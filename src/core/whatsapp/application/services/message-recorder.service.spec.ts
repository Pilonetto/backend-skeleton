import { MessageRecorderService } from './message-recorder.service';
import { Repository } from 'typeorm';
import { Message } from '../../domain/entities/message.entity';

// 🧪 Este teste verifica se o serviço cria e salva corretamente uma mensagem no banco de dados (simulado).
describe('MessageRecorderService', () => {
  let service: MessageRecorderService;
  let messageRepo: jest.Mocked<Repository<Message>>;

  beforeEach(() => {
    messageRepo = {
      create: jest.fn().mockImplementation((data) => data),
      save: jest.fn().mockResolvedValue({ id: 1 }),
    } as any;

    service = new MessageRecorderService(
      messageRepo,
      { findOne: jest.fn() } as any,
      { findOne: jest.fn() } as any,
    );
  });

  it('should record a sent text message', async () => {
    const result = await service.recordMessage({
      number: '5511999999999',
      campaignId: 1,
      type: 'text',
      content: 'Promoção imperdível!',
      status: 'success',
    });

    expect(messageRepo.create).toHaveBeenCalled();
    expect(messageRepo.save).toHaveBeenCalled();
    expect(result).toHaveProperty('id');
  });
});
