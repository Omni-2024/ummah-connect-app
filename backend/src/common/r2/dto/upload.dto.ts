import { IsDefined } from 'class-validator';
import {
  MemoryStoredFile,
  HasMimeType,
  IsFile,
  MaxFileSize,
} from "nestjs-form-data";

export class PublicUploadDto {
  @IsDefined()
  @IsFile()
  @MaxFileSize(1e6 * 2)
  @HasMimeType(["image/jpeg", "image/png", "image/jpg", "image/webp"])
  imageFile: MemoryStoredFile;

}