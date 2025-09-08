import { IsArray, IsBoolean, IsInt, IsNumber, IsOptional, IsString } from 'class-validator';
import { PaginatedRequestDto } from '../../users/dto/base.dto';
import { PartialType } from '@nestjs/mapped-types';

export class CreateServiceDto {
  @IsString()
  title: string;


  @IsString()
  tagline: string;

  @IsString()
  description: string;

  @IsString()
  coverImageUrl: string;

  @IsString()
  providerId: string;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsInt()
  totalReviewScore?: number;

  @IsOptional()
  @IsInt()
  totalReviewCount?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  averageReviewScore?: number;

  @IsOptional()
  @IsString()
  specialtyId?: string;

  @IsString()
  professionId: string;


  @IsArray()
  learningPoints: string[];


  @IsNumber()
  discount: number;

  @IsBoolean()
  discountEnabled: boolean;

  // @IsOptional()
  // @IsNumber()
  // duration?: number;

  @IsBoolean()
  @IsOptional()
  isPublished: boolean;

  @IsBoolean()
  @IsOptional()
  isArchived: boolean;

  @IsOptional()
  @IsString()
  slug: string;
}


export class UpdateServiceDto extends PartialType(CreateServiceDto) {

  @IsString()
  id: string;
}

export class FindOneServiceDto {
  @IsString()
  id: string;
}

export class FindServiceBySlugDto {
  @IsString()
  slug: string;
}

export class FindAllByProviderServiceDto extends PaginatedRequestDto {
  @IsString()
  providerId: string;

  @IsOptional()
  @IsBoolean()
  isPublished: boolean;

  @IsOptional()
  @IsBoolean()
  isArchived: boolean;
}

export class SearchServiceDto extends PaginatedRequestDto {
  @IsOptional()
  @IsString()
  professionId?: string;

  @IsOptional()
  @IsString()
  professionIds?: string[];

  @IsOptional()
  @IsString()
  typeId?: string;

  @IsOptional()
  @IsString()
  typeIds?: string[];

  @IsOptional()
  @IsString()
  specialtyIds?: string[];

  @IsOptional()
  @IsString()
  specialtyId?: string;

  @IsOptional()
  @IsInt()
  lowerCmeRange?: number;


  @IsOptional()
  @IsInt()
  upperCmeRange?: number;

  @IsOptional()
  @IsString()
  search?: string;

  @IsBoolean()
  isPublished: boolean;

  @IsBoolean()
  isArchived: boolean;

  @IsOptional()
  @IsString()
  providerIds?: string[];


  @IsOptional()
  @IsBoolean()
  isPopular?: boolean;
}

export class ProviderDto {
  id: string;

  name: string;

  designation: string;

  @IsOptional()
  bio: string;

  profileImageUrl: string;
}


export class ServiceDetailDto {
  id: string;

  title: string;

  tagline: string;

  description: string;

  coverImageUrl: string;

  learningPoints: string[];

  @IsOptional()
  provider: ProviderDto;

  price: number;

  totalReviewScore: number;

  totalReviewCount: number;

  averageReviewScore: number;

  specialty?: { name: string; id: string };


  profession: { name: string; id: string };

  discount: number;

  discountEnabled: boolean;

  duration: number;

  @IsOptional()
  enrollmentCount?: number;

  slug: string;

  isArchived: boolean;
}








