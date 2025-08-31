import { Global, Module } from '@nestjs/common';
import { SpecialistService } from './specialist.service';
import { SpecialistController } from './specialist.controller';
import { SpecialistRepository } from './specialist.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Specialist } from './entities/specialist.entity';
@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Specialist])],
  controllers: [SpecialistController],
  providers: [SpecialistService, SpecialistRepository],
  exports: [SpecialistRepository],
})
export class SpecialistModule {}
