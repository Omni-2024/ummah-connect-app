import { IsNumber, IsString } from 'class-validator';
import { AbstractBaseEntity } from '../../../users/entities/abstract.base.entity';

export abstract class AbstractProfessionCategoryEntity extends AbstractBaseEntity {
  @IsString()
  name: string;
  @IsNumber({ maxDecimalPlaces: 2 })
  price: number;
}