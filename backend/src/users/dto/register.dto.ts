import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
export class RegisterDto {
  @IsOptional() @IsString() name?: string;
  @IsEmail() email!: string;
  @MinLength(8) password!: string;
}

export class RegisterSocialDto {
  email: string;

  name: string;

  profileImage: string;
}