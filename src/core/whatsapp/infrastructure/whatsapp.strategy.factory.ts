import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OfficialWhatsappStrategy } from './strategies/official-whatsapp.strategy';
import { UnofficialWhatsappStrategy } from './strategies/unofficial-whatsapp.strategy';
import { IWhatsappStrategy } from '../domain/interfaces/whatsapp-strategy.interface';
import { SenderNumber } from '../domain/entities/sender-number.entity';

@Injectable()
export class WhatsappStrategyFactory {
  constructor(
    private readonly config: ConfigService,
    private readonly official: OfficialWhatsappStrategy,
    private readonly unofficial: UnofficialWhatsappStrategy,
  ) {}

  getStrategy(): IWhatsappStrategy {
    const provider = this.config.get('WHATSAPP_PROVIDER');
    return provider === 'unofficial' ? this.unofficial : this.official;
  }

  create(sender: SenderNumber): IWhatsappStrategy {
    switch (sender.provider) {
      case 'official':
        return this.official;
      case 'unofficial':
        return this.unofficial;
      default:
        throw new Error(`Unknown provider: ${sender.provider}`);
    }
  }
}
