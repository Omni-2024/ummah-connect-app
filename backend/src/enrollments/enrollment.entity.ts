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
import { AbstractEnrollmentEntity, certificateStatusType } from './abstract.enrollment.entity';

// @Index('enrollment-user-course-index', ['userId', 'courseId'], { unique: true })
@Entity('enrollment')
export class EnrollmentEntity
  extends BaseEntity
  implements AbstractEnrollmentEntity
{
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

  @CreateDateColumn({ name: 'enrollment_date', update: false })
  enrollmentDate: Date;

  @Column('uuid', { name: 'user_id' })
  userId: string;

  @Column('uuid', { name: 'service_id' })
  serviceId: string;

  @Column({ default: 0 })
  progression: number;

  @Column({ name: 'completed_at', default: null, nullable: true, type: 'date' })
  completedAt: Date;

  @Column({ default: false })
  completed: boolean;


  @Column({ default: false, name: 'certificate_issued' })
  certificateIssued: boolean;

  @Column({
    default: certificateStatusType.PENDING,
    name: 'certificate_status',
    type: 'enum',
    enum: certificateStatusType,
  })
  certificateStatus: certificateStatusType;

}
