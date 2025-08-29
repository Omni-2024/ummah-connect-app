import { IsString } from 'class-validator';
export class SetPasswordDto {
  @IsString() id!: string;
  @IsString() password!: string;
  @IsString() otp!: string;
}