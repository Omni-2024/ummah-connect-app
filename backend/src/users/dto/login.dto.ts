import { IsEmail, MinLength } from 'class-validator';
export class LoginDto {
  @IsEmail() email!: string;
  @MinLength(8) password!: string;
}

export enum SocialType {
  GOOGLE = "google",
  FACEBOOK = "facebook",
  LINKEDIN = "linkedin",
  TWITTER = "twitter",
  GITHUB = "github",
  APPLE = "apple",
}

export class GoogleUser {
  sub: string;
  name: string;
  given_name: string;
  picture: string;
  email: string;
  email_verified: boolean;
}