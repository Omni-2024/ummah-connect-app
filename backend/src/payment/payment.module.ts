import { Global, Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentEntity } from './payment.entity';
import { PaymentRepository } from './payment.repository';
import { Service } from '../services/entities/service.entity';
import { UserEntity } from '../users/entities/user.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([PaymentEntity, Service, UserEntity])],
  providers: [PaymentService, PaymentRepository],
  controllers: [PaymentController],
  exports: [PaymentService],
})
export class PaymentModule {}
