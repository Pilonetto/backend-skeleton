import axios from 'axios';
import { IWhatsappStrategy } from '../../domain/interfaces/whatsapp-strategy.interface';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SenderNumber } from '../../domain/entities/sender-number.entity';

@Injectable()
export class OfficialWhatsappStrategy implements IWhatsappStrategy {
  constructor(private readonly config: ConfigService) {}

  async sendTextMessage(
    to: string,
    message: string,
    sender: SenderNumber,
  ): Promise<any> {
    const url = `${this.config.get('WHATSAPP_API_URL')}/${sender.phoneNumberId}/messages`;

    return axios.post(
      url,
      {
        messaging_product: 'whatsapp',
        to,
        type: 'text',
        text: { body: message },
      },
      {
        headers: {
          Authorization: `Bearer ${sender.token}`,
          'Content-Type': 'application/json',
        },
      },
    );
  }

  async sendMediaMessage(
    to: string,
    media: Buffer | string,
    caption?: string,
  ): Promise<any> {
    // Para simplificar, vamos simular o envio de mídia (em produção, seria com upload + id de mídia)
    return {
      status: 'media message sent (simulated)',
      to,
      caption,
    };
  }

  async sendTempateMessage(
    to: string,
    templateName: string,
    sender: SenderNumber,
  ): Promise<any> {
    const url = `${this.config.get('WHATSAPP_API_URL')}/${sender.phoneNumberId}/messages`;

    return axios.post(
      url,
      {
        messaging_product: 'whatsapp',
        to,
        type: 'template',
        template: {
          name: templateName,
          language: {
            code: 'en_US',
          },
        },
      },
      {
        headers: {
          Authorization: `Bearer ${sender.token}`,
          'Content-Type': 'application/json',
        },
      },
    );
  }

  async getStatus(): Promise<string> {
    return 'Official WhatsApp Strategy Active';
  }
}
