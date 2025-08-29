import { Reflector } from '@nestjs/core';
import { UserRole } from '../../users/entities/abstract.user.entity';

export const ROLES_KEY = 'roles';
export const Roles = Reflector.createDecorator<UserRole[]>();
