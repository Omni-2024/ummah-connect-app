import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('payment')
export class PaymentEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', { name: '_id' })
  id: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column('uuid', { name: 'user_id', nullable: true })
  userId?: string;

  @Column('uuid', { name: 'service_id', nullable: true })
  serviceId?: string;

  @Column({ nullable: true })
  serviceName?: string;

  @Column({ nullable: true })
  status?: string;

  @Column({ nullable: true })
  receiptUrl?: string;

  @Column({ nullable: true })
  last4?: string;

  @Column({ nullable: true })
  paymentMethod?: string;

  @Column({ unique: true })
  paymentIntent: string;

  @Column({ nullable: true })
  amount?: number;

  @Column({ unique: true, nullable: true })
  chargeId?: string;

  @CreateDateColumn({ name: 'paid_at' })
  paidToProviderDate?: Date;

  @Column({ default: false })
  paidToProvider?: boolean;

}
