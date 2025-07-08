import { SenderNumber } from '../entities/sender-number.entity';

export interface IWhatsappStrategy {
  sendTextMessage(
    to: string,
    message: string,
    sender: SenderNumber,
  ): Promise<any>;
  sendMediaMessage(
    to: string,
    media: Buffer | string,
    caption?: string,
    sender?: SenderNumber,
  ): Promise<any>;
  sendTempateMessage(
    to: string,
    templateName: string,
    sender: SenderNumber,
  ): Promise<any>;
  getStatus(): Promise<string>;
}
