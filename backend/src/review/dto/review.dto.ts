import { IsOptional, IsString, IsNumber } from "class-validator";

export class CreateReviewDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  serviceId?: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsNumber()
  stars: number;
}

export class GetReviewResponseDto {

  userId?: string;

  providerId?:string;

  serviceId?: string;

  description?: string;

  status?: string;

  stars?: number;

  createdAt?: Date;

  updatedAt?: Date;
}

export class UpdateReviewDto extends CreateReviewDto {

  @IsString()
  id: string;
}
