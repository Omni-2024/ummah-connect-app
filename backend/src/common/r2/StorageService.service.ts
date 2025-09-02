import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StorageService {
  private readonly s3: S3Client;
  private readonly bucket: string;
  private readonly publicBaseUrl: string;

  constructor(private readonly config: ConfigService) {
    this.s3 = new S3Client({
      region: 'auto',
      endpoint: this.config.getOrThrow<string>('R2_ENDPOINT'),
      forcePathStyle: true, // important for R2
      credentials: {
        accessKeyId: this.config.getOrThrow<string>('R2_ACCESS_KEY_ID'),
        secretAccessKey: this.config.getOrThrow<string>('R2_SECRET_ACCESS_KEY'),
      },
    });

    this.bucket = this.config.getOrThrow<string>('R2_BUCKET_NAME');
    this.publicBaseUrl = this.config.getOrThrow<string>('R2_PUBLIC_BASE_URL'); // ← points to public domain, NOT the API endpoint
  }

  async uploadFile(key: string, body: Buffer, contentType: string) {
    await this.s3.send(new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
      // (Optional but recommended)
      // CacheControl: 'public, max-age=31536000, immutable',
    }));

    // Just return the public URL (no signing needed)
    const url = `${this.publicBaseUrl}/${key}`;
    return { key, url };
  }
}
