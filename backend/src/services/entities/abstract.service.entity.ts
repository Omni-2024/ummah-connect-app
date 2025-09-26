import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
} from "class-validator";
import { AbstractBaseEntity } from '../../users/entities/abstract.base.entity';

export abstract class AbstractServiceEntity extends AbstractBaseEntity {
  @IsString()
  title: string;

  @IsString()
  tagline: string;

  @IsString()
  description: string;

  @IsUrl()
  coverImageUrl: string;

  @IsString()
  providerId: string;

  @IsString()
  price: number;

  @IsInt()
  totalReviewScore?: number;

  @IsInt()
  totalReviewCount?: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  averageReviewScore?: number;

  @IsNumber()
  enrollmentCount: number;

  @IsOptional()
  @IsString()
  specialtyId?: string;

  @IsString()
  professionId: string;

  @MinLength(1, { each: true })
  learningPoints: string[];

  @IsOptional()
  @MinLength(1, { each: true })
  whyMe: string[];

  @IsNumber()
  discount: number;

  @IsBoolean()
  discountEnabled: boolean;

  @IsNumber()
  duration: number;

  @IsBoolean()
  isPublished?: boolean;

  @IsBoolean()
  isArchived?: boolean;

  @IsString()
  slug: string;
}
