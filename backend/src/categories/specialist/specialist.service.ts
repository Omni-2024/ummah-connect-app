import { BadRequestException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { SpecialistRepository } from './specialist.repository';
import {
  CreateSpecialistDto,
  FindOneSpecialistDto,
  UpdateSpecialistDto,
} from './dto/specialist.dto';

@Injectable()
export class SpecialistService {
  constructor(private readonly specialistRepo: SpecialistRepository) {}

  async create(createSpecialistDto: CreateSpecialistDto) {
      const isAvailable = await this.specialistRepo.findOneByName(
        createSpecialistDto.name,
      );

      if (isAvailable) {
        throw new BadRequestException('Profession Already Available');
      }
      const specialist = await this.specialistRepo.create(createSpecialistDto);
      return specialist;
  }

  async findOne(findOneSpecialistDto: FindOneSpecialistDto) {
      const specialist =
        await this.specialistRepo.findOne(findOneSpecialistDto);
      if (!specialist) {
        throw new NotFoundException('No specialist found');
      }
      return specialist ;
  }

  async update(updateSpecialistDto: UpdateSpecialistDto) {
      const specialist = await this.specialistRepo.update(updateSpecialistDto);
      if (!specialist) {
        throw new NotFoundException('No specialist found');
      }
      return specialist ;
  }

  async remove(findOneSpecialistDto: FindOneSpecialistDto) {
      const specialist =
        await this.specialistRepo.findOne(findOneSpecialistDto);
      if (!specialist) {
        throw new NotFoundException('No specialist found');
      }
      await this.specialistRepo.delete(findOneSpecialistDto);
      return  specialist ;
  }
}
