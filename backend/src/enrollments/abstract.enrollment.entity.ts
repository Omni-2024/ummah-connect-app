import { IsDate } from "class-validator";
import { AbstractBaseEntity } from '../users/entities/abstract.base.entity';

export enum certificateStatusType {
  PENDING = "PENDING",
  ISSUED = "ISSUED",
  ERROR = "ERROR",
}
export abstract class AbstractEnrollmentEntity extends AbstractBaseEntity {

  @IsDate()
  enrollmentDate: Date;

  userId: string;

  serviceId: string;

  progression: number;

  completedAt: Date;

  completed: boolean;

  certificateIssued: boolean;

  certificateStatus: certificateStatusType;

}
