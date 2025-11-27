import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as emailjs from '@emailjs/nodejs';

type SendParams = Record<string, string | number | boolean | undefined>;

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(private readonly config: ConfigService) {}

  private get ids() {
    return {
      serviceId: this.config.get<string>('EMAILJS_SERVICE_ID') || '',
      publicKey: this.config.get<string>('EMAILJS_PUBLIC_KEY') || '',
      privateKey: this.config.get<string>('EMAILJS_PRIVATE_KEY') || '',
    };
  }

  private toStringParams(params: SendParams): Record<string, string> {
    return Object.fromEntries(
      Object.entries(params)
        .filter(([, v]) => v !== undefined)
        .map(([k, v]) => [k, String(v)]),
    );
  }

  private async send(templateId: string, params: SendParams): Promise<boolean> {
    const { serviceId, publicKey, privateKey } = this.ids;

    if (!serviceId || !publicKey || !templateId) {
      this.logger.warn('Missing EmailJS config or template id');
      return false;
    }

    try {
      const res = await emailjs.send(
        serviceId,
        templateId,
        this.toStringParams(params),
        { publicKey, privateKey },
      );
      return res.status === 200;
    } catch (err) {
      this.logger.error('EmailJS error', err);
      return false;
    }
  }

  async sendOtpEmail(opts: {
    user_email: string;
    otp: string;
    heading: string;
    name: string;
    body: string;
  }): Promise<boolean> {
    const templateId = this.config.get<string>('EMAILJS_TEMPLATE_OTP') || '';
    return this.send(templateId, opts);
  }

  async sendEmailConformation(opts: {
    name:string;
    email: string;
    link: string;
  }): Promise<boolean> {
    const templateId =
      this.config.get<string>('EMAILJS_TEMPLATE_EMAIL_CONFORMATION') || '';
    return this.send(templateId, opts);
  }

  async sendEmailUserBookConfirmation(opts: {
    name:string;
    email: string;
    service_name: string;
    order_id: string;
    amount: number;
    date: string;
    link: string;
  }): Promise<boolean> {
    const templateId =
      this.config.get<string>('EMAILJS_TEMPLATE_USER_BOOK_CONFIRMATION') || '';
    return this.send(templateId, opts);
  }

  async sendEmailProviderBookConfirmation(opts: {
    provider_name:string;
    email: string;
    service_name: string;
    order_id: string;
    link: string;
  }): Promise<boolean> {
    const templateId =
      this.config.get<string>('EMAILJS_TEMPLATE_PROVIDER_BOOK_CONFIRMATION') || '';
    return this.send(templateId, opts);
  }

  async resetPassword(opts: {
    name:string;
    email: string;
    reset_link: string;
  }): Promise<boolean> {
    const templateId =
      this.config.get<string>('EMAILJS_TEMPLATE_RESET_PASSWORD') || '';
    return this.send(templateId, opts);
  }
}
