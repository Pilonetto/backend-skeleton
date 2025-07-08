import { SendCampaignUseCase } from './send-campaign.use-case';
import { MessageRecorderService } from '../../services/message-recorder.service';
import { Repository } from 'typeorm';
import { SenderNumber } from '../../../domain/entities/sender-number.entity';
// 🧪 Este teste valida o fluxo principal do envio de campanha com texto e com mídia
describe('SendCampaignUseCase', () => {
  let useCase: SendCampaignUseCase;
  let senderRepo: jest.Mocked<Repository<SenderNumber>>;
  let recorder: jest.Mocked<MessageRecorderService>;

  beforeEach(() => {
    senderRepo = {
      findOneBy: jest.fn().mockResolvedValue({
        id: 1,
        provider: 'unofficial',
        active: true,
      }),
    } as any;

    recorder = {
      recordMessage: jest.fn().mockResolvedValue({}),
    } as any;

    useCase = new SendCampaignUseCase(senderRepo, recorder);
  });

  it('should send messages to phones and return results', async () => {
    const dto = {
      senderNumberId: 1,
      phones: ['5511999999999'],
      message: 'Promo',
    };

    const result = await useCase.execute(dto);
    expect(result[0].phone).toBe('5511999999999');
    expect(result[0].success).toBe(true);
  });

  it('should record failed message on exception', async () => {
    // simula falha forçando erro em strategy
    const failingUseCase = new SendCampaignUseCase(
      {
        findOneBy: jest.fn().mockResolvedValue({
          id: 1,
          provider: 'unofficial',
          active: true,
        }),
      } as any,
      recorder,
    );

    jest.spyOn(failingUseCase as any, 'getStrategy').mockReturnValue({
      sendTextMessage: () => {
        throw new Error('Fail');
      },
      sendMediaMessage: () => {
        throw new Error('Fail');
      },
      getStatus: async () => 'ok',
    });

    const result = await failingUseCase.execute({
      senderNumberId: 1,
      phones: ['5511999999999'],
      message: 'Erro proposital',
    });

    expect(result[0].success).toBe(false);
    expect(result[0].error).toBe('Fail');
  });
});
