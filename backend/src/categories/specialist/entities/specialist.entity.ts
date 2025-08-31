import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
import { AbstractSpecialistCategoryEntity } from './abstract.specialist.entity';

@Entity('specialist')
export class Specialist
  extends BaseEntity
  implements AbstractSpecialistCategoryEntity
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

  @Column()
  name: string;

  @Column()
  price: number;

  @Column({ name: 'profession_id', type: 'uuid' })
  professionId: string;

}
