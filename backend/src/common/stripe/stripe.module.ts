import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';
import { UsersModule } from '../../users/users.module';
import { ServiceModule } from '../../services/services.module';
import { PaymentModule } from '../../payment/payment.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { Service } from '../../services/entities/service.entity';
import { Profession } from '../../categories/profession/entities/profession.entity';

@Module({
  imports: [
    UsersModule,
    ServiceModule,
    PaymentModule,
    TypeOrmModule.forFeature([UserEntity, Service, Profession]),
  ],
  providers: [StripeService],
  controllers: [StripeController],
  exports: [StripeService],
})
export class StripeModule {}
