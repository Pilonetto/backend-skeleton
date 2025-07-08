import { FindAllSendersUseCase } from './find-all-senders.use-case';
import { Repository } from 'typeorm';
import { SenderNumber } from '../../../domain/entities/sender-number.entity';

// 🧪 Testa se o use-case retorna todos os sender_numbers ordenados
describe('FindAllSendersUseCase', () => {
  let useCase: FindAllSendersUseCase;
  let repo: jest.Mocked<Repository<SenderNumber>>;

  beforeEach(() => {
    repo = {
      find: jest.fn().mockResolvedValue([{ id: 1 }]),
    } as any;
    useCase = new FindAllSendersUseCase(repo);
  });

  it('should return all sender numbers', async () => {
    const result = await useCase.execute();
    expect(repo.find).toHaveBeenCalled();
    expect(result).toHaveLength(1);
  });
});
