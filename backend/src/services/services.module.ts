import { Module } from '@nestjs/common';
import { ServiceController } from './services.controller';
import { ServiceService } from './services.service';
import { ServiceRepository } from './service.repository';
import { ServiceDetailService } from './service.detail.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';
import { ProviderModule } from '../providers/provider.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Service]),
    ProviderModule,
    UsersModule
  ],
  controllers: [ServiceController],
  providers: [ServiceService, ServiceRepository, ServiceDetailService],
  exports: [ServiceRepository,ServiceService,ServiceDetailService]
})
export class ServiceModule {}
