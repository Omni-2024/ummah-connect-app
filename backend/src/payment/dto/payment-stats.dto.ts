import { IsEnum, IsInt, IsISO8601, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export enum ScopeType {
  ALL = 'all',
  LAST_WEEK = 'last_week',
  LAST_30D = 'last_30d',
  MONTH = 'month',
  RANGE = 'range',
}

export enum GroupByType {
  NONE = 'none',
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
}

export class PaymentStatsQueryDto {
  @IsOptional()
  @IsEnum(ScopeType)
  scope: ScopeType = ScopeType.LAST_30D;

  @IsOptional()
  @IsEnum(GroupByType)
  groupBy: GroupByType = GroupByType.NONE;

  // for scope=MONTH
  @IsOptional() @Type(() => Number) @IsInt() @Min(1)
  month?: number; // 1..12

  @IsOptional() @Type(() => Number) @IsInt()
  year?: number;

  // for scope=RANGE
  @IsOptional() @IsISO8601()
  start?: string;

  @IsOptional() @IsISO8601()
  end?: string;

  // branch key: if present → provider stats; else → global
  @IsOptional() @IsString()
  providerId?: string;

  // optional tuning
  @IsOptional() @Type(() => Number) @IsInt() @Min(1)
  topLimit?: number; // default 5
}
