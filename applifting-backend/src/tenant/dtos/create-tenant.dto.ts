import { IsString } from 'class-validator';

export class CreateTenantDto {
  @IsString()
  name: string;

  @IsString()
  password: string;
}
