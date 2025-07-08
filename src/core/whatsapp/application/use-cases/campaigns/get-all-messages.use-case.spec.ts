import { GetAllMessagesUseCase } from './get-all-messages.use-case';
import { Message } from '../../../domain/entities/message.entity';
import { Repository } from 'typeorm';

// 🧪 Testa se o use-case retorna a lista de mensagens do repositório, incluindo os relacionamentos
describe('GetAllMessagesUseCase', () => {
  let useCase: GetAllMessagesUseCase;
  let repo: jest.Mocked<Repository<Message>>;

  beforeEach(() => {
    repo = {
      find: jest
        .fn()
        .mockResolvedValue([{ id: 1, type: 'text', content: 'msg' }]),
    } as any;

    useCase = new GetAllMessagesUseCase(repo);
  });

  it('should return all messages with relations', async () => {
    const result = await useCase.execute();
    expect(repo.find).toHaveBeenCalledWith({
      relations: ['contact', 'campaign'],
      order: { createdAt: 'DESC' },
    });
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe('text');
  });
});
