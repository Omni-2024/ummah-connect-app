import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserEntity } from './entities/user.entity';
import { UserRepository } from './user.repository';
import { StreamModule } from '../common/getStream/stream.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), StreamModule],
  providers: [UsersService,UserRepository],
  controllers: [UsersController],
  exports: [UsersService, TypeOrmModule,UserRepository],
})
export class UsersModule {}
