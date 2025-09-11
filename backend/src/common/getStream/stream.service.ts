import { Inject, Injectable } from '@nestjs/common';
import { StreamChat, Channel } from 'stream-chat';
import { StreamClient } from '@stream-io/node-sdk';
import { UserRole } from '../../users/entities/abstract.user.entity';

@Injectable()
export class StreamService {
  constructor(
    @Inject('STREAM_CHAT') private readonly chat: StreamChat,
    @Inject('STREAM_VIDEO') private readonly video: StreamClient,
  ) {}

  async upsertUser(id: string, name: string, role: UserRole) {
    await this.chat.upsertUser({ id, name, role });
    return { id, name, role };
  }

  createChatToken(userId: string) {
    return this.chat.createToken(userId);
  }

  async getOrCreateDirectChannel(userId: string, providerId: string) {
    const channel: Channel = this.chat.channel(
      'messaging',
      undefined,
      { members: [userId, providerId] },
    );
    await channel.create();
    return channel.id;
  }

  async sendSystemMessage(channelId: string, text: string, userId: string) {
    const channel = this.chat.channel('messaging', channelId);
    await channel.sendMessage({ user_id: userId, text, type: 'system' });
  }


  /**
   * Create or fetch a booking call. Uses bookingId as call id (stable).
   */
  async createBookingCall({
                            bookingId,
                            userId,
                            providerId,
                            startsAt,
                          }: {
    bookingId: string;
    userId: string;
    providerId: string;
    startsAt?: string | Date;
  }) {
    const call = this.video.video.call('default', bookingId);

    // Normalize to Date | undefined (and validate)
    const startsAtDate: Date | undefined =
      startsAt == null
        ? undefined
        : (startsAt instanceof Date ? startsAt : new Date(startsAt));

    if (startsAtDate && Number.isNaN(startsAtDate.getTime())) {
      throw new Error('Invalid startsAt value');
    }

    await call.getOrCreate({
      data: {
        starts_at: startsAtDate,
        members: [
          { user_id: userId, role: 'participant' },
          { user_id: providerId, role: 'host' },
        ],
        custom: { bookingId },
      },
    });

    return { callId: bookingId, type: 'default' };
  }
  /**
   * Generate a user token for Video. (Role optional; align with your dashboard roles.)
   */
  createVideoToken(userId: string, role?: 'host' | 'participant') {
    return this.video.generateUserToken({ user_id: userId, role });
  }

  async getCallDetails(meetingId: string) {
    const call = this.video.video.call('default', meetingId);
    return call.get();
  }

  async startRecording(meetingId: string) {
    const call = this.video.video.call('default', meetingId);
    await call.startRecording();
    return { ok: true };
  }

  async stopRecording(meetingId: string) {
    const call = this.video.video.call('default', meetingId);
    await call.stopRecording();
    return { ok: true };
  }
}
