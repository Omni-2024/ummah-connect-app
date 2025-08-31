import { IsNumber, IsString } from 'class-validator';

export class CreateSpecialistDto {
  @IsString()
  name: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  price: number;

  @IsString()
  professionId: string;

  @IsString()
  typeId: string;
}

export class UpdateSpecialistDto extends CreateSpecialistDto {
  @IsString()
  id: string;
}

export class FindOneSpecialistDto {
  @IsString()
  id: string;
}

export class FindAllSpecialistsByProfessionDto {
  @IsString()
  professionId: string;
}


export class SpecialistDto {
  id: string;
  name: string;
  price: number;
  professionId: string;

}