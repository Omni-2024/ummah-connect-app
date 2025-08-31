import { Global, Module } from '@nestjs/common';
import { ProfessionService } from './profession.service';
import { ProfessionController } from './profession.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfessionRepository } from './profession.repository';
import { Profession } from './entities/profession.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Profession])],
  controllers: [ProfessionController],
  providers: [ProfessionService, ProfessionRepository],
  exports: [ProfessionRepository],
})
export class ProfessionModule {}
