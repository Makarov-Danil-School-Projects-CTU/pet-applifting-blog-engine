import { IsNumber, IsString } from "class-validator";

export class LoginResponseDto {
  @IsString()
  access_token: string;
  
  @IsNumber()
  expires_in: number;

  @IsString()
  token_type: string;
}