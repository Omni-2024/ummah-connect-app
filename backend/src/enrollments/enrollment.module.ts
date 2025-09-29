import { Module } from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';
import { EnrollmentController } from './enrollment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnrollmentEntity } from './enrollment.entity';
import { PaymentModule } from '../payment/payment.module';
import { UsersModule } from '../users/users.module';
import { ServiceModule } from '../services/services.module';
import { EnrollmentRepository } from './enrollment.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([EnrollmentEntity]),
    PaymentModule,
    UsersModule,
    ServiceModule,
  ],
  controllers: [EnrollmentController],
  providers: [EnrollmentService, EnrollmentRepository],
})
export class EnrollmentModule {}
