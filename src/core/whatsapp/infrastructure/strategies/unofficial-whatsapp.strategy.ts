import { IWhatsappStrategy } from '../../domain/interfaces/whatsapp-strategy.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UnofficialWhatsappStrategy implements IWhatsappStrategy {
  async sendTextMessage(to: string, message: string): Promise<any> {
    return {
      simulated: true,
      to,
      message,
      status: 'unofficial message sent',
    };
  }

  async sendMediaMessage(
    to: string,
    media: Buffer | string,
    caption?: string,
  ): Promise<any> {
    return {
      simulated: true,
      to,
      media,
      caption,
      status: 'unofficial media sent',
    };
  }

  async getStatus(): Promise<string> {
    return 'Unofficial WhatsApp Strategy Active';
  }

  async sendTempateMessage(to: string, templateName: string): Promise<any> {
    return {
      simulated: true,
      to,
      templateName,
      status: 'unofficial tempate sent',
    };
  }
}
