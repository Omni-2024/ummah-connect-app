import { IsArray, IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

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
