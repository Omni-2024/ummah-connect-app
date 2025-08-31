import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceModule } from '../services/services.module';
import { UsersModule } from '../users/users.module';
import { ReviewEntity } from './entities/review.entity';
import { ReviewRepository } from './review.repository';
import { Service } from '../services/entities/service.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReviewEntity,Service]),
    ServiceModule,
    UsersModule,
  ],
  providers: [ReviewService,ReviewRepository],
  controllers: [ReviewController]
})
export class ReviewModule {}
