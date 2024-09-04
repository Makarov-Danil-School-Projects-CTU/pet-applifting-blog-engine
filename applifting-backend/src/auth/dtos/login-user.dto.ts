import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({ description: 'The username of the created tenant' })
  @IsString()
  @IsNotEmpty()
  @Length(5, 20)
  username: string;

  @ApiProperty({ description: 'The password of the created tenant' })
  @IsString()
  @IsNotEmpty()
  @Length(6, 50)
  password: string;
}
