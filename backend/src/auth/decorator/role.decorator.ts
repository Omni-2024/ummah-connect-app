import { Reflector } from '@nestjs/core';
import { UserRole } from '../../users/entities/abstract.user.entity';

export const Roles = Reflector.createDecorator<UserRole[]>();
