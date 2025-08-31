import { Controller, Get, HttpStatus } from '@nestjs/common';
import { Public } from '../auth/decorator/public.decorator';
import { ProfessionRepository } from './profession/profession.repository';
import { SpecialistRepository } from './specialist/specialist.repository';
import { SpecialistDto } from './specialist/dto/specialist.dto';


type ProfessionWithSpecialistsDto = {
  id: string;
  name: string;
  price?: number;
  order?: number;
  specialists: SpecialistDto[];
};


@Controller('category')
export class CategoryController {
  constructor(
    private readonly professionService: ProfessionRepository,
    private readonly specialistService: SpecialistRepository,  ) {}

  @Public()
  @Get()
  async findAll() {

    const professions = await this.professionService.findAll();

    const data: ProfessionWithSpecialistsDto[] = await Promise.all(
      (professions ?? []).map(async (profession) => {
        const specialists = await this.specialistService.findAllByProfession({
          professionId: profession.id,
        });

        const specialistsDto: SpecialistDto[] = (specialists ?? []).map((s) => ({
          id: s.id,
          name: s.name,
          price: s.price,
          professionId: s.professionId,
        }));

        return {
          id: profession.id,
          name: profession.name,
          price: profession.price,
          order: profession.order,
          specialists: specialistsDto,
        };
      }),
    );

    return data
  }
}
