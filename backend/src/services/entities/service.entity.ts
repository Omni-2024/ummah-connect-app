import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  VersionColumn,
  Column, BaseEntity,
} from 'typeorm';
import { AbstractServiceEntity } from './abstract.service.entity';

@Entity('service')
export class Service extends BaseEntity implements AbstractServiceEntity {
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
  title: string;

  @Column()
  tagline: string;

  @Column()
  description: string;

  @Column({ name: 'cover_image_url' })
  coverImageUrl: string;

  @Column({ name: 'provider_id' })
  providerId: string;

  @Column({ default: 0, type: 'float' })
  price: number;

  @Column({
    name: 'total_review_score',
    default: 0,
    type: 'bigint',
    nullable: true,
  })
  totalReviewScore: number;

  @Column({
    name: 'total_review_count',
    default: 0,
    type: 'bigint',
    nullable: true,
  })
  totalReviewCount: number;

  @Column({
    name: 'average_review_score',
    type: 'decimal', // Change to 'decimal' or 'numeric'
    precision: 4, // Total number of digits
    scale: 1, // Number of digits after the decimal point
    default: 0,
    nullable: true,
  })
  averageReviewScore: number;

  @Column({
    name: 'enrollment_count',
    default: 0,
    type: 'bigint',
    nullable: true,
  })
  enrollmentCount: number;

  @Column({ name: 'specialty_id', nullable: true, type: 'uuid' })
  specialtyId?: string;

  @Column({ name: 'profession_id', type: 'uuid' })
  professionId: string;

  @Column({ name: 'learning_points', type: 'jsonb' })
  learningPoints: string[];

  @Column({ default: 0, type: 'float' })
  discount: number;

  @Column({ name: 'discount_enabled', default: false })
  discountEnabled: boolean;

  @Column({ type: 'int', nullable: true, default: 0 })
  duration: number;

  @Column({ name: 'is_published', default: false })
  isPublished: boolean;

  @Column({ name: 'is_archived', default: false })
  isArchived: boolean;

  @Column({ name: 'slug', default: '' })
  slug: string;
}
