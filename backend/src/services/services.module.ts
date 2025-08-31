import { Module } from '@nestjs/common';
import { ServiceController } from './services.controller';
import { ServiceService } from './services.service';
import { ServiceRepository } from './service.repository';
import { ServiceDetailService } from './service.detail.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Service]),
  ],
  controllers: [ServiceController],
  providers: [ServiceService, ServiceRepository, ServiceDetailService],
  exports: [ServiceRepository]
})
export class ServiceModule {}
