import { UserRole } from '../../users/entities/abstract.user.entity';

export class LoginResponseDto {
  token!: string;
  refreshToken!: string;
  id!: string;
  role!: UserRole;
  isFirstLogin!: boolean;
}