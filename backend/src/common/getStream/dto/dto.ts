import { IsISO8601, IsOptional, IsString } from 'class-validator';
import { UserRole } from '../../../users/entities/abstract.user.entity';

export class UpsertUserDto {
  @IsString() id: string;
  @IsString() name: string;
  @IsString() role: UserRole;
}

export class DirectChatDto {
  @IsString() userId: string;
  @IsString() providerId: string;
}

export class BookingCallDto {
  @IsString() bookingId: string;
  @IsString() userId: string;
  @IsString() providerId: string;
  @IsOptional() @IsISO8601() startsAt?: string;
}

export class VideoTokenDto {
  @IsString() userId: string;
  @IsOptional() @IsString() role?: 'host' | 'participant';
}

export class CallIdBodyDto {
  @IsString() meetingId: string;
}
