import { UserRole } from '../../users/entities/abstract.user.entity';

export type JwtPayload = { id: string; email: string; role: UserRole };
