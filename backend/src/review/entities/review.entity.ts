import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Unique,
  BeforeInsert,
  BeforeUpdate,
  EntityRepository,
  Repository,
} from 'typeorm';

@Entity('review')
@Unique(['userId', 'serviceId'])
export class ReviewEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', { name: '_id' })
  id: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column('uuid', { name: 'user_id', nullable: false })
  userId?: string;

  @Column('uuid', { name: 'provider_id', nullable: false })
  providerId?: string;

  @Column('uuid', { name: 'serviceId', nullable: true })
  serviceId?: string;

  @Column()
  description: string;

  @Column()
  stars: number;

  @Column({ nullable: true, default: 'pending' })
  status?: string;

  // Enforcing validation that either serviceId must be provided, but not both or neither
  @BeforeInsert()
  @BeforeUpdate()
  validateCourseOrWebinarId() {
    if ((this.serviceId ) || (!this.serviceId)) {
      throw new Error('Either serviceId  must be provided, but not both or neither.');
    }
  }
}
