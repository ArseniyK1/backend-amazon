import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class AuthDTO {
  // @IsOptional()
  @IsEmail()
  email: string;

  @MinLength(6, { message: 'Password must be at latest 6 characters long' })
  @IsString()
  password: string;
}
//
