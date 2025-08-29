import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AbstractBaseEntity } from './abstract.base.entity';

export enum UserRole {
  ROOT = 'root',
  ADMIN = 'admin',
  OPERATIONAL_ADMIN = 'operational_admin',
  USER = 'user',
  BUSINESS_ADMIN = 'business_admin',
  BUSINESS_USER = 'business_user',
}

export enum SigninMethod {
  EMAIL = 'email',
  SOCIAL = 'social',
}

export declare abstract class AbstractUserEntity extends AbstractBaseEntity {
  name: string;
  email: string;
  password: any;
  token: string;
  role: UserRole;
  salt: string;
  active: boolean;
  verified: boolean;
  stripeId: string;
  designations: string[];
  interests: string[];
  profileImage: string;
  specializations: string;
  company: string;
  country: string;
  averageScore: number;
  totalCme: number;
  totalCourses: number;
  totalCoursesCompleted: number;
  totalActiveCourses: number;
  isFirstLogin: boolean;
  signinMethod: SigninMethod;
  otp: string;
  otpExpires: Date;
}
