import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';
import { AbstractUserEntity, SigninMethod, UserRole } from './abstract.user.entity';

@Entity('user')
export class UserEntity extends BaseEntity implements AbstractUserEntity {
  async comparePassword(password: string) {
    return await bcrypt.compare(password, this.password);
  }

  async hashPassword() {
    this.salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, this.salt);
  }

  @PrimaryGeneratedColumn('uuid', { name: '_id' })
  id: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  @VersionColumn({ name: '_v' })
  version: number;

  @Column()
  name: string;

  @Column({ nullable: true, default: null })
  bio: string;

  @Index('email-index', { unique: true })
  @Column({ unique: true })
  email: string;

  @Exclude({ toPlainOnly: true })
  @Column({ nullable: true, default: null })
  password: string;

  @Column({ nullable: true, default: null })
  token: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Exclude({ toPlainOnly: true })
  @Column({ nullable: true, default: null })
  salt: string;

  @Column({ default: true })
  active: boolean;

  @Column({ default: false })
  verified: boolean;

  @Column({ name: 'stripe_id', nullable: true, default: null })
  stripeId: string;

  @Column({ nullable: true, default: null, type: 'simple-array' })
  designations: string[];

  @Column({ nullable: true, default: null, type: 'simple-array' })
  interests: string[];

  @Column({ nullable: true, default: null, name: 'profile_image' })
  profileImage: string;

  @Column({ nullable: true, default: null })
  specializations: string;

  @Column({ nullable: true, default: null })
  company: string;

  @Column({ nullable: true, default: null })
  country: string;

  @Column({ nullable: true, default: null, type: 'simple-array' })
  languages: string[];

  @Column({ nullable: true, default: null })
  contactNumber: string;

  @Column({
    nullable: true,
    default: null,
    name: 'average_score',
    type: 'real',
  })
  averageScore: number;

  @Column({ nullable: true, default: null, name: 'total_cme', type: 'real' })
  totalCme: number;

  @Column({ nullable: true, default: null, name: 'total_services' })
  totalServices: number;

  @Column({ nullable: true, default: null, name: 'total_services_completed' })
  totalServicesCompleted: number;

  @Column({ nullable: true, default: null, name: 'total_active_services' })
  totalActiveServices: number;

  @Column({ default: true, name: 'is_first_login' })
  isFirstLogin: boolean;

  @Column({
    type: 'enum',
    enum: SigninMethod,
    default: SigninMethod.SOCIAL,
    name: 'signin_method',
  })
  signinMethod: SigninMethod;

  @Exclude({ toPlainOnly: true })
  @Column({ nullable: true, default: null })
  otp: string;

  @Column({ name: 'otp_expires', nullable: true, default: null })
  otpExpires: Date;

  @Column({ nullable: true, default: null })
  stripeCustomerId: string;
}
