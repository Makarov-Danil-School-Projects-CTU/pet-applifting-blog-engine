import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateTenantDto {
  @ApiProperty({ description: 'The name of the tenant', example: 'user1' })
  @IsString()
  @IsNotEmpty()
  @Length(5, 20)
  name: string;

  @ApiProperty({ description: 'The API key for the tenant', example: '123123' })
  @IsString()
  @IsNotEmpty()
  @Length(6, 50)
  password: string;
}
