import { IsArray, IsInt, IsNumber, IsOptional, IsString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateServiceDto } from '../../services/dto/service.dto';
import { Gender } from '../entities/abstract.user.entity';

export class PaginatedRequestDto {
  limit?: number;
  offset?: number;
}

export class SearchUserDto extends PaginatedRequestDto {
  @IsString()
  query?: string;
}

export class UpdateUserDto {
  @IsString()
  id: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  gender?: Gender;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsArray()
  @IsOptional()
  designations?: string[];

  @IsArray()
  @IsOptional()
  interests?: string[];

  @IsString()
  @IsOptional()
  profileImage?: string;

  @IsString()
  @IsOptional()
  specializations?: string;

  @IsString()
  @IsOptional()
  company?: string;

  @IsString()
  @IsOptional()
  country?: string;

  @IsString()
  @IsOptional()
  contactNumber?: string;

  @IsArray()
  @IsOptional()
  languages?: string[];

  @IsOptional()
  @IsInt()
  totalReviewScore?: number;

  @IsOptional()
  @IsInt()
  totalReviewCount?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  averageReviewScore?: number;
}

export class CreatePaymentDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  serviceId?: string;

  @IsOptional()
  @IsString()
  serviceName?: string;

  @IsString()
  status: string;

  @IsString()
  receiptUrl: string;

  @IsString()
  last4: string;

  @IsString()
  paymentMethod: string;

  @IsString()
  paymentIntent: string;

  @IsNumber()
  amount: number;

  @IsString()
  chargeId: string;
}

export class UpdatePaymentDto extends PartialType(CreatePaymentDto) {

  @IsString()
  id: string;
}

