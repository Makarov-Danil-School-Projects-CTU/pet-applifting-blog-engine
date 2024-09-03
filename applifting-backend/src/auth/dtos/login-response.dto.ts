import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class LoginResponseDto {
  @ApiProperty({
    description: 'The access token used for authentication',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsString()
  access_token: string;
  
  @ApiProperty({
    description: 'The time in seconds until the access token expires',
    example: 3600,
  })
  @IsNumber()
  expires_in: number;

  @ApiProperty({
    description: 'The type of token being returned',
    example: 'bearer',
  })
  @IsString()
  token_type: string;
}