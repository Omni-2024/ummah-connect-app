import { Optional } from "@nestjs/common";
import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";

export class EnrollUserDto {
  @IsString()
  serviceId: string;

  @IsString()
  userId: string;
}

export class UpdateTrackDto {
  @IsString()
  serviceId: string;

  userId: string;

  @IsString()
  status: string;
}

export class EnrollUserResponseDto {
  @IsString()
  serviceId: string;

  @IsString()
  userId: string;

  @IsString()
  enrollmentId: string;

  @IsNumber()
  progress: number;

}



export class EnrollmentStatusDto {
  @IsString()
  serviceId: string;

  @IsString()
  userId: string;

  enrollmentId: string;

  enrollmentDate: Date;

  progression: number;

  completedAt: Date;

  completed: boolean;

}
