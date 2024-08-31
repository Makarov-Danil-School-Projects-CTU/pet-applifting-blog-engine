import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { scrypt as _scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

import { Article } from 'src/entities/article.entity';
import { Tenant } from '../entities/tenant.entity';
import { CreateTenantDto } from './dtos/create-tenant.dto';

const scrypt = promisify(_scrypt);

interface ExternalApiTenantResponse {
  tenantId: string;
  apiKey: string;
  name: string;
  createdAt: Date;
  lastUsedAt: null;
}

@Injectable()
export class TenantService {
  constructor(
    @InjectRepository(Tenant) private tenantRepository,
    @InjectRepository(Article) private articleRepository,
  ) {}

  private tenantApiUrl = 'https://fullstack.exercise.applifting.cz/tenants';

  async create({ name, password }: CreateTenantDto): Promise<Tenant> {
    const tenants = await this.tenantRepository.find({ where: { name } });

    if (tenants.length) {
      throw new BadRequestException('Name is in use');
    }

    try {
      const response = await axios.post<ExternalApiTenantResponse>(
        this.tenantApiUrl,
        {
          name,
          password,
        },
      );

      // Generate a salt
      const salt = randomBytes(8).toString('hex');

      // Hash the salt and the password together
      const hash = (await scrypt(password, salt, 32)) as Buffer;

      // Join the hashed result and the salt together
      const result = salt + '.' + hash.toString('hex');

      const tenantData = response.data;

      const tenant = this.tenantRepository.create({
        tenantId: tenantData.tenantId,
        apiKey: tenantData.apiKey,
        name: tenantData.name,
        password: result,
        createdAt: new Date(tenantData.createdAt),
        lastUsedAt: null,
        articles: [],
      });

      return this.tenantRepository.save(tenant);
    } catch (error) {
      throw new HttpException(
        'Failed to create tenant',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  findOne(tenantId: string): Promise<Tenant> {
    if (!tenantId) {
      return null;
    }

    return this.tenantRepository.findOne({
      where: { tenantId },
      relations: ['articles'],
    });
  }
}
