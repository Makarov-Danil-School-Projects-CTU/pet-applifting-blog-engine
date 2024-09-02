import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({description: "The username of the created tenant"})
  @IsString()
  username: string;

  @ApiProperty({description: "The password of the created tenant"})
  @IsString()
  password: string;
}
