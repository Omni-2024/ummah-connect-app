import { Controller, Post, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { randomUUID } from 'crypto';
import { extname } from 'path';
import { StorageService } from './StorageService.service';

@Controller('files')
export class StorageController {
  constructor(private readonly storage: StorageService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No file uploaded');

    const key = `uploads/${new Date().toISOString().slice(0,10)}/${randomUUID()}${extname(file.originalname)}`;
    const { url } = await this.storage.uploadFile(key, file.buffer, file.mimetype);

    return { key, url };
  }
}
