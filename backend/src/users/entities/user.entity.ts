// src/users/entities/user.entity.ts
import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn,
  DeleteDateColumn, VersionColumn
} from 'typeorm';

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export enum SignInMethod {
  EMAIL = 'EMAIL',
  GOOGLE = 'GOOGLE',
  GITHUB = 'GITHUB',
  APPLE = 'APPLE',
}

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid', { name: '_id' })
  _id: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deleted_at?: Date | null;

  @VersionColumn({ name: '_v' })
  _v: number;

  @Column({ type: 'varchar', length: 150, nullable: true })
  name?: string;

  @Column({ type: 'varchar', length: 190, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255, select: false })
  password: string;

  // Store a hashed refresh token (so if DB leaks, tokens can’t be reused).
  @Column({ type: 'text', nullable: true, select: false })
  token?: string | null;

  @Column({ type: 'varchar', length: 20, default: UserRole.USER })
  role: UserRole;

  // bcrypt salt string used to hash the password
  @Column({ type: 'varchar', length: 120, select: false })
  salt: string;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  @Column({ type: 'boolean', default: false })
  verified: boolean;

  @Column({ type: 'varchar', length: 120, nullable: true })
  stripe_id?: string | null;

  @Column({ type: 'text', array: true, nullable: true })
  designations?: string[] | null;

  @Column({ type: 'text', array: true, nullable: true })
  interests?: string[] | null;

  @Column({ type: 'text', nullable: true })
  profile_image?: string | null;

  @Column({ type: 'text', array: true, nullable: true })
  specializations?: string[] | null;

  @Column({ type: 'varchar', length: 150, nullable: true })
  company?: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  country?: string | null;

  @Column({ type: 'float', default: 0 })
  average_score: number;

  @Column({ type: 'int', default: 0 })
  total_cme: number;

  @Column({ type: 'int', default: 0 })
  total_courses: number;

  @Column({ type: 'int', default: 0 })
  total_courses_completed: number;

  @Column({ type: 'int', default: 0 })
  total_active_courses: number;

  @Column({ type: 'int', default: 0 })
  total_webinars: number;

  @Column({ type: 'int', default: 0 })
  total_webinars_completed: number;

  @Column({ type: 'int', default: 0 })
  total_active_webinars: number;

  @Column({ type: 'boolean', default: true })
  is_first_login: boolean;

  @Column({ type: 'varchar', length: 20, default: SignInMethod.EMAIL })
  signin_method: SignInMethod;

  @Column({ type: 'varchar', length: 10, nullable: true, select: false })
  otp?: string | null;

  @Column({ type: 'timestamptz', nullable: true, select: false })
  otp_expires?: Date | null;

//   // Note: You listed both 'stripe_id' and 'stripeCustomerId'; keeping both
//   @Column({ type: 'varchar', length: 120, nullable: true })
//   stripeCustomerId?: string | null;

    // @Column({ name: 'stripeCustomerId', type: 'varchar', length: 120, nullable: true })
    // stripeCustomerId?: string | null;

    @Column({ type: 'varchar', length: 120, nullable: true })
    stripeCustomerId?: string | null;

}
