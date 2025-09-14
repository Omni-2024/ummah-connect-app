import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { StreamChat } from 'stream-chat';
import { StreamClient } from '@stream-io/node-sdk';
import { StreamService } from './stream.service';
import { StreamController } from './stream.controller';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'STREAM_CHAT',
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) =>
        StreamChat.getInstance(
          cfg.get<string>('STREAM_KEY')!,
          cfg.get<string>('STREAM_SECRET')!,
        ),
    },
    {
      provide: 'STREAM_VIDEO',
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) =>
        new StreamClient(
          cfg.get<string>('STREAM_KEY')!,
          cfg.get<string>('STREAM_SECRET')!,
        ),
    },
    StreamService,
  ],
  controllers:[StreamController],
  exports: [StreamService],
})
export class StreamModule {}
