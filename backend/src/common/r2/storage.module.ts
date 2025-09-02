import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StorageController } from './StorageService.controller';
import { StorageService } from './StorageService.service';



@Module({
  imports: [ConfigModule],
  controllers: [StorageController],
  providers: [StorageService],
  exports: [StorageService], // export if other modules need it
})
export class StorageModule {}
