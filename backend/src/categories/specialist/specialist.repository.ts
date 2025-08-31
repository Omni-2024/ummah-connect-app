import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Specialist } from './entities/specialist.entity';
import {
  CreateSpecialistDto,
  FindAllSpecialistsByTypeDto,
  FindOneSpecialistDto,
  UpdateSpecialistDto,
} from './dto/specialist.dto';

@Injectable()
export class SpecialistRepository {
  constructor(
    @InjectRepository(Specialist)
    private readonly professionRepository: Repository<Specialist>,
  ) {}

  async create(createSpecialistDto: CreateSpecialistDto): Promise<Specialist> {
    try {
      const specialist =
        await this.professionRepository.create(createSpecialistDto);
      return await this.professionRepository.save(specialist);
    } catch (e) {
      throw e;
    }
  }

  async findAllByType(
    findAllSpecialistsByTypeDto: FindAllSpecialistsByTypeDto,
  ): Promise<Specialist[] | null> {
    try {
      return await this.professionRepository.findBy(
        findAllSpecialistsByTypeDto,
      );
    } catch (e) {
      throw e;
    }
  }

  async findOne(
    findOneSpecialistDto: FindOneSpecialistDto,
  ): Promise<Specialist | null> {
    try {
      return await this.professionRepository.findOneBy(findOneSpecialistDto);
    } catch (e) {
      throw e;
    }
  }

  async update(
    updateSpecialistDto: UpdateSpecialistDto,
  ): Promise<Specialist | null> {
    try {
      const specialist = await this.professionRepository.findOneBy({
        id: updateSpecialistDto.id,
      });
      if (!specialist) {
        return null;
      }
      const updatedSpecialist = this.professionRepository.merge(
        specialist,
        updateSpecialistDto,
      );
      return await this.professionRepository.save(updatedSpecialist);
    } catch (e) {
      throw e;
    }
  }

  async delete(
    findOneSpecialistDto: FindOneSpecialistDto,
  ): Promise<Specialist | null> {
    try {
      const specialist =
        await this.professionRepository.findOneBy(findOneSpecialistDto);
      if (!specialist) {
        return null;
      }
      return await this.professionRepository.softRemove(specialist);
    } catch (e) {
      throw e;
    }
  }

  async findOneByName(name: string): Promise<Specialist | null> {
    try {
      return await this.professionRepository.findOneBy({
        name: name,
        deletedAt: IsNull(),
      });
    } catch (e) {
      throw e;
    }
  }
}
