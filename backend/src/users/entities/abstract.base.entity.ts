import { Exclude } from "class-transformer";
import { IsDateString, IsNumber, IsString } from "class-validator";

export abstract class AbstractBaseEntity {
  @IsString()
  id: string;

  @Exclude()
  @IsDateString()
  createdAt: Date;

  @Exclude()
  @IsDateString()
  updatedAt: Date;

  @Exclude()
  @IsDateString()
  deletedAt: Date;

  @Exclude()
  @IsNumber()
  version: number;
}
