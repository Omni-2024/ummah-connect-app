import { IsInt, IsString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateServiceDto } from '../../services/dto/service.dto';

export class CreateFaqQuestionDto {
  @IsString()
  serviceId: string;

  @IsString()
  question: string;

  @IsInt()
  order: number;

  @IsString()
  answer: string;
}

export class FindAllFaqQuestionByServiceIdDto {
  @IsString()
  serviceId: string;
}

export class FindOneFaqQuestionDto {
  @IsString()
  id: string;
}

export class UpdateFaqQuestionDto extends PartialType(CreateFaqQuestionDto) {
  id: string;
}