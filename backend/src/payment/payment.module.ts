import { Global, Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentEntity } from './payment.entity';
import { PaymentRepository } from './payment.repository';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([PaymentEntity])],
  providers: [PaymentService, PaymentRepository],
  controllers: [PaymentController],
  exports: [PaymentService],
})
export class PaymentModule {}
