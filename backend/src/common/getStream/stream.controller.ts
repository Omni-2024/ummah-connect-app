import {
  Body, Controller, Get, Param, Post, HttpCode, BadRequestException,
} from '@nestjs/common';
import { StreamService } from './stream.service';
import { BookingCallDto, DirectChatDto, UpsertUserDto, VideoTokenDto, CallIdBodyDto } from './dto/dto';

@Controller('stream')
export class StreamController {
  constructor(private readonly svc: StreamService) {}

  @Post('upsert-user')
  async upsertUser(@Body() dto: UpsertUserDto) {
    const user = await this.svc.upsertUser(dto.id, dto.name, dto.role);
    const chatToken = this.svc.createChatToken(dto.id);
    return { user, chatToken };
  }

  @Post('direct-channel')
  async direct(@Body() dto: DirectChatDto) {
    const channelId = await this.svc.getOrCreateDirectChannel(dto.userId, dto.providerId);
    return { channelId, type: 'messaging' };
  }

  @Post('booking-call')
  async createCall(@Body() dto: BookingCallDto) {
    const { callId, type } = await this.svc.createBookingCall(dto);
    return { callId, type };
  }

  @Post('video-token')
  @HttpCode(200)
  async videoToken(@Body() dto: VideoTokenDto) {
    if (!dto.userId) throw new BadRequestException('userId is required');
    const token = this.svc.createVideoToken(dto.userId, dto.role);
    return { token };
  }

  @Get('calls/:meetingId')
  async getCall(@Param('meetingId') meetingId: string) {
    if (!meetingId) throw new BadRequestException('meetingId is required');
    try {
      const callDetails = await this.svc.getCallDetails(meetingId);
      return { callDetails };
    } catch (e: any) {
      // Stream gRPC NotFound => code 16 in some clients
      if (e?.code === 16) {
        return { message: 'Meeting not found in GetStream', error: e?.metadata };
      }
      throw e;
    }
  }

  @Post('recording/start')
  async startRecording(@Body() dto: CallIdBodyDto) {
    if (!dto.meetingId) throw new BadRequestException('meetingId is required');
    await this.svc.startRecording(dto.meetingId);
    return { message: 'Recording started' };
  }

  @Post('recording/stop')
  async stopRecording(@Body() dto: CallIdBodyDto) {
    if (!dto.meetingId) throw new BadRequestException('meetingId is required');
    await this.svc.stopRecording(dto.meetingId);
    return { message: 'Recording stopped' };
  }
}
