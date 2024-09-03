import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateTenantDto {
  @ApiProperty({ description: 'The name of the tenant', example: "user1" })
  @IsString()
  name: string;

  @ApiProperty({ description: 'The API key for the tenant', example: "123123" })
  @IsString()
  @Length(3, 50)
  password: string;
}
