import { IsNumber, IsString } from 'class-validator';
import { AbstractBaseEntity } from '../../../users/entities/abstract.base.entity';

export abstract class AbstractSpecialistCategoryEntity extends AbstractBaseEntity {
  @IsString()
  name: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  price: number;

  @IsString()
  professionId: string;


}
