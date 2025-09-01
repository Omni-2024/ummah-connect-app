import { BadRequestException, ConflictException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProfessionDto, FindOneProfessionDto, UpdateProfessionDto } from './dto/profession.dto';
import { ProfessionRepository } from './profession.repository';

@Injectable()
export class ProfessionService {
  constructor(private readonly professionRepo: ProfessionRepository) {}

  async create(createProfessionDto: CreateProfessionDto) {
    const maxOrder = (await this.professionRepo.getMaxOrder()) ?? 0;

    const isAvailable = await this.professionRepo.findOneByName(
      createProfessionDto.name,
    );

    if (isAvailable) {
      throw new ConflictException('Service already exists');
    }

    const profession = await this.professionRepo.create({
      ...createProfessionDto,
      order: maxOrder + 1,
    });

    return profession;
  }


  async findAll() {
      const professions = await this.professionRepo.findAll();
      if (!professions) {
        throw new BadRequestException('No profession found');      }
      if (professions.length === 0) {
        throw new NotFoundException('No profession found');
      }
      return  professions ;
  }

  async findOne(
    findOneProfessionDto: FindOneProfessionDto,
  ) {
      const profession =
        await this.professionRepo.findOne(findOneProfessionDto);
      if (!profession) {
        throw new NotFoundException('No profession found');
      }
      return  profession ;
  }

  async update(
    updateProfessionDto: UpdateProfessionDto,
  ) {
      const profession = await this.professionRepo.update(updateProfessionDto);
      if (!profession) {
        throw new NotFoundException('No profession found');
      }
      return  profession ;
  }

  async remove(
    findOneProfessionDto: FindOneProfessionDto,
  ){
      const profession = await this.professionRepo.remove(findOneProfessionDto);
      if (!profession) {
        throw new NotFoundException('No profession found');
      }
      return  profession ;
  }
}
