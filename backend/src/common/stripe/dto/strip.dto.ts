import { IsEmail, IsNumber, IsOptional, IsString } from "class-validator";
import { PurchaseType } from "./stripe.entity";
import Stripe from 'stripe';

export class CreateSessionResponseDto {
  clientSecret: string | null;
}

export class SessionMetadataDto {
  service_id: string | null;

  user_id: string | null;

  service_name: string | null;

}

export class GetSessionStatusResponseDto {
  status: string | null;

  metadata: SessionMetadataDto;
}

export class CreateCustomerDto {
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsString()
  userId: string;
}

export class CreateCheckoutDto {
  @IsString()
  userId: string;

  @IsOptional()
  @IsString()
  serviceId?: string;


  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsString()
  purchaseType: PurchaseType;

  @IsString()
  priceId?: string;

  @IsString()
  couponId?: string;
}

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  categoryId?: string;
}

export class UpdateProductDto {
  @IsString()
  productId: string;

  update: Stripe.ProductUpdateParams;
}

export class CreatePriceDto {
  @IsNumber()
  unit_amount: number;

  @IsString()
  productId: string;

  @IsString()
  interval: Stripe.Price.Recurring.Interval;
}

export class UpdatePriceDto {
  @IsString()
  priceId: string;

  update: Stripe.PriceUpdateParams;
}