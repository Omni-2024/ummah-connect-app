import { IsNumber, IsString } from 'class-validator';

export class CreateProfessionDto {
  @IsString()
  name: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  price: number;

  @IsNumber()
  order: number;
}

export class UpdateProfessionDto extends CreateProfessionDto {
  @IsString()
  id: string;

  @IsNumber()
  declare order: number;
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
