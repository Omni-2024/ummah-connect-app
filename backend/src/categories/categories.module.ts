import { Module } from '@nestjs/common';
import { CategoryController } from './categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profession } from './profession/entities/profession.entity';
import { Specialist } from './specialist/entities/specialist.entity';
import { ProfessionRepository } from './profession/profession.repository';
import { SpecialistRepository } from './specialist/specialist.repository';

@Module({
  imports: [ TypeOrmModule.forFeature([Profession, Specialist])],
  controllers: [CategoryController],
  providers: [ProfessionRepository, SpecialistRepository],
  exports: [ProfessionRepository, SpecialistRepository],
})
export class CategoryModule {}
