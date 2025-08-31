import { HttpStatus, Injectable } from '@nestjs/common';
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
    try {
      const isAvailable = await this.specialistRepo.findOneByName(
        createSpecialistDto.name,
      );

      if (isAvailable) {
        return {
          status: HttpStatus.BAD_REQUEST,
          error: 'Profession Already Available',
        };
      }
      const specialist = await this.specialistRepo.create(createSpecialistDto);
      return specialist;
    } catch (e) {
      return { status: HttpStatus.INTERNAL_SERVER_ERROR, error: e };
    }
  }

  async findOne(findOneSpecialistDto: FindOneSpecialistDto) {
    try {
      const specialist =
        await this.specialistRepo.findOne(findOneSpecialistDto);
      if (!specialist) {
        return { status: HttpStatus.NOT_FOUND, error: 'No specialist found' };
      }
      return specialist ;
    } catch (e) {
      return { status: HttpStatus.INTERNAL_SERVER_ERROR, error: e };
    }
  }

  async update(updateSpecialistDto: UpdateSpecialistDto) {
    try {
      const specialist = await this.specialistRepo.update(updateSpecialistDto);
      if (!specialist) {
        return { status: HttpStatus.NOT_FOUND, error: 'No specialist found' };
      }
      return specialist ;
    } catch (e) {
      return { status: HttpStatus.INTERNAL_SERVER_ERROR, error: e };
    }
  }

  async remove(findOneSpecialistDto: FindOneSpecialistDto) {
    try {
      const specialist =
        await this.specialistRepo.findOne(findOneSpecialistDto);
      if (!specialist) {
        return { status: HttpStatus.NOT_FOUND, error: 'No specialist found' };
      }
      await this.specialistRepo.delete(findOneSpecialistDto);
      return  specialist ;
    } catch (e) {
      return { status: HttpStatus.INTERNAL_SERVER_ERROR, error: e };
    }
  }
}
