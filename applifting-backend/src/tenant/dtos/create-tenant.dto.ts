import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateTenantDto {
  @ApiProperty({ description: 'The name of the tenant' })
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'The API key for the tenant' })
  @ApiProperty()
  @IsString()
  password: string;
}
