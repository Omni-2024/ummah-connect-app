import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { AbstractBaseEntity } from '../users/entities/abstract.base.entity';


export abstract class AbstractFaqQuestionEntity extends AbstractBaseEntity {

  @IsString()
  serviceId: string;

  @IsString()
  question: string;

  @IsInt()
  order: number;

  @IsString()
  answer: string;
}