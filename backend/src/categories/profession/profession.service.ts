import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateProfessionDto, FindOneProfessionDto, UpdateProfessionDto } from './dto/profession.dto';
import { ProfessionRepository } from './profession.repository';

@Injectable()
export class ProfessionService {
  constructor(private readonly professionRepo: ProfessionRepository) {}
  async create(
    createProfessionDto: CreateProfessionDto,
  ){
    try {
      const maxOrder = (await this.professionRepo.getMaxOrder()) ?? 0;

      const isAvailable = await this.professionRepo.findOneByName(
        createProfessionDto.name,
      );
      if (isAvailable) {
        return {
          status: HttpStatus.BAD_REQUEST,
          error: 'Profession Already Available',
        };
      }
      const profession = await this.professionRepo.create({
        ...createProfessionDto,
        order: maxOrder + 1,
      });
      return profession ;
    } catch (e) {
      return { status: HttpStatus.INTERNAL_SERVER_ERROR, error: e };
    }
  }

  async findAll() {
    try {
      const professions = await this.professionRepo.findAll();
      if (!professions) {
        return { status: HttpStatus.BAD_REQUEST, error: 'No profession found' };
      }
      if (professions.length === 0) {
        return { status: HttpStatus.NOT_FOUND, error: 'No profession found' };
      }
      return  professions ;
    } catch (e) {
      return { status: HttpStatus.INTERNAL_SERVER_ERROR, error: e };
    }
  }

  async findOne(
    findOneProfessionDto: FindOneProfessionDto,
  ) {
    try {
      const profession =
        await this.professionRepo.findOne(findOneProfessionDto);
      if (!profession) {
        return { status: HttpStatus.NOT_FOUND, error: 'No profession found' };
      }
      return  profession ;
    } catch (e) {
      return { status: HttpStatus.INTERNAL_SERVER_ERROR, error: e };
    }
  }

  async update(
    updateProfessionDto: UpdateProfessionDto,
  ) {
    try {
      const profession = await this.professionRepo.update(updateProfessionDto);
      if (!profession) {
        return { status: HttpStatus.NOT_FOUND, error: 'No profession found' };
      }
      return  profession ;
    } catch (e) {
      return { status: HttpStatus.INTERNAL_SERVER_ERROR, error: e };
    }
  }

  async remove(
    findOneProfessionDto: FindOneProfessionDto,
  ){
    try {
      const profession = await this.professionRepo.remove(findOneProfessionDto);
      if (!profession) {
        return { status: HttpStatus.NOT_FOUND, error: 'No profession found' };
      }
      return  profession ;
    } catch (e) {
      return { status: HttpStatus.INTERNAL_SERVER_ERROR, error: e };
    }
  }
}
