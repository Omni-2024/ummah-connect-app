import { IsNumber, IsString } from 'class-validator';

export class CreateProfessionDto {
  @IsString()
  name: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  price: number;

  @IsNumber()
  order: number;
}

declare const UpdateProfessionDto_base: import("@nestjs/common").Type<Partial<CreateProfessionDto>>;
export declare class UpdateProfessionDto extends UpdateProfessionDto_base {
  @IsString()
  id: string;

  @IsNumber()
  order: number;
}

export class FindOneProfessionDto {
  @IsString()
  id: string;
}

export class ProfessionDto {
  id: string;
  name: string;
  price: number;
  order: number;
}
