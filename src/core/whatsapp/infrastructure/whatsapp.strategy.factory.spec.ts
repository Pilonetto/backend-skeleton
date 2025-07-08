import { WhatsappStrategyFactory } from './whatsapp.strategy.factory';
import { OfficialWhatsappStrategy } from './strategies/official-whatsapp.strategy';
import { UnofficialWhatsappStrategy } from './strategies/unofficial-whatsapp.strategy';
import { SenderNumber } from 'src/core/whatsapp/domain/entities/sender-number.entity';
import { ConfigService } from '@nestjs/config';

describe('WhatsappStrategyFactory', () => {
  let factory: WhatsappStrategyFactory;
  let official: OfficialWhatsappStrategy;
  let unofficial: UnofficialWhatsappStrategy;
  let config: ConfigService;

  beforeEach(() => {
    official = {
      sendTextMessage: jest.fn(),
      sendMediaMessage: jest.fn(),
    } as any;
    unofficial = {
      sendTextMessage: jest.fn(),
      sendMediaMessage: jest.fn(),
    } as any;
    factory = new WhatsappStrategyFactory(config, official, unofficial);
  });

  it('should return OfficialWhatsappStrategy for "official" provider', () => {
    const sender: Partial<SenderNumber> = { provider: 'official' };
    const strategy = factory.create(sender as SenderNumber);
    expect(strategy).toBe(official);
  });

  it('should return UnofficialWhatsappStrategy for "unofficial" provider', () => {
    const sender: Partial<SenderNumber> = { provider: 'unofficial' };
    const strategy = factory.create(sender as SenderNumber);
    expect(strategy).toBe(unofficial);
  });

  it('should throw error for unknown provider', () => {
    const sender = { provider: 'unknown' } as any;
    expect(() => factory.create(sender)).toThrowError(
      'Unknown provider: unknown',
    );
  });
});
