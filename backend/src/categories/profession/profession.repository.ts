import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Profession } from './entities/profession.entity';
import { CreateProfessionDto, FindOneProfessionDto, UpdateProfessionDto } from './dto/profession.dto';


@Injectable()
export class ProfessionRepository {
  constructor(
    @InjectRepository(Profession)
    private readonly professionRepository: Repository<Profession>,
  ) {}

  async create(createProfessionDto: CreateProfessionDto): Promise<Profession> {
    try {
      const profession = this.professionRepository.create(createProfessionDto);
      return await this.professionRepository.save(profession);
    } catch (e) {
      throw e;
    }
  }

  async findAll(): Promise<Profession[] | null> {
    try {
      return await this.professionRepository.find({ order: { order: 'ASC' } });
    } catch (e) {
      throw e;
    }
  }

  async findOne({ id }: FindOneProfessionDto): Promise<Profession | null> {
    try {
      return await this.professionRepository.findOneBy({ id });
    } catch (e) {
      throw e;
    }
  }

  async update(
    updateProfessionDto: UpdateProfessionDto,
  ): Promise<Profession | null> {
    try {
      const profession = await this.professionRepository.findOneBy({
        id: updateProfessionDto.id,
      });
      if (!profession) {
        return null;
      }
      const update = this.professionRepository.merge(
        profession,
        updateProfessionDto,
      );
      return await this.professionRepository.save(update);
    } catch (e) {
      throw e;
    }
  }

  async remove(
    findOneProfessionDto: FindOneProfessionDto,
  ): Promise<Profession | null> {
    try {
      const profession =
        await this.professionRepository.findOneBy(findOneProfessionDto);
      if (!profession) {
        return null;
      }
      return await this.professionRepository.softRemove(profession);
    } catch (e) {
      throw e;
    }
  }

  async findOneByName(name: string): Promise<Profession | null> {
    try {
      return await this.professionRepository.findOneBy({
        name: name,
        deletedAt: IsNull(),
      });
    } catch (e) {
      throw e;
    }
  }

  async getMaxOrder(): Promise<number> {
    try {
      const profession = await this.professionRepository.maximum('order');
      if (!profession) {
        return 0;
      }
      return profession;
    } catch (e) {
      throw e;
    }
  }
}
