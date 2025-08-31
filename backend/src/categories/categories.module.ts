import { Module } from '@nestjs/common';
import { ProfessionModule } from './profession/profession.module';
import { SpecialistModule } from './specialist/specialist.module';
import { CategoryController } from './categories.controller';

@Module({
  imports: [ProfessionModule, SpecialistModule],
  controllers: [CategoryController],
  providers: [],
})
export class CategoryModule {}
