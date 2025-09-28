import { IsString } from 'class-validator';
import { CreateReviewDto } from '../../review/dto/review.dto';
import { PartialType } from '@nestjs/mapped-types';

export declare class CreatePaymentDto {
  userId?: string;
  serviceId?: string;
  serviceName?: string;
  status: string;
  receiptUrl: string;
  last4: string;
  paymentMethod: string;
  paymentIntent: string;
  amount: number;
  chargeId: string;
}
export declare class GetPaymentResponseDto {
  userId?: string;
  serviceId?: string;
  serviceName?: string;
  status?: string;
  receiptUrl?: string;
  last4?: string;
  paymentMethod?: string;
  paymentIntent: string;
  amount?: number;
  chargeId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class UpdatePaymentDto extends PartialType(CreatePaymentDto) {
  @IsString()
  id: string;
}
export class UpsertPaymentDto extends PartialType(CreatePaymentDto) {
}

