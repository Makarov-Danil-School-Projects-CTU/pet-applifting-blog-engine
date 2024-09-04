import { ApiProperty } from "@nestjs/swagger";

export class LoginResponseDto {
  @ApiProperty({
    description: 'The access token used for authentication',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token: string;
  
  @ApiProperty({
    description: 'The time in seconds until the access token expires',
    example: 3600,
  })
  expires_in: number;

  @ApiProperty({
    description: 'The type of token being returned',
    example: 'bearer',
  })
  token_type: string;
}