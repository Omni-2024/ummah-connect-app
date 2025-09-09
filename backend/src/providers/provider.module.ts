import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProvidersService } from './providers.service';
import { ProviderRepository } from './providers.repository';
import { ProvidersController } from './providers.controller';
import { UserEntity } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [ProvidersService,ProviderRepository],
  controllers: [ProvidersController],
  exports: [ProvidersService, TypeOrmModule,ProviderRepository],
})
export class ProviderModule {}
