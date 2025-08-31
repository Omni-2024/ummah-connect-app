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
import { AbstractProfessionCategoryEntity } from './abstract.profession.entity';

@Entity('profession')
export class Profession
  extends BaseEntity
  implements AbstractProfessionCategoryEntity
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

  @Column({ default: 0 })
  order: number;
}
