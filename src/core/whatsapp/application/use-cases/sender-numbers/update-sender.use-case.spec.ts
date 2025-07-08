import { UpdateSenderUseCase } from './update-sender.use-case';
import { Repository } from 'typeorm';
import { SenderNumber } from '../../../domain/entities/sender-number.entity';

// 🧪 Testa se o use-case atualiza corretamente um sender existente
describe('UpdateSenderUseCase', () => {
  let useCase: UpdateSenderUseCase;
  let repo: jest.Mocked<Repository<SenderNumber>>;

  beforeEach(() => {
    repo = {
      findOneBy: jest.fn().mockResolvedValue({ id: 1, phoneNumber: '123' }),
      save: jest.fn().mockResolvedValue({ id: 1, phoneNumber: '456' }),
    } as any;
    useCase = new UpdateSenderUseCase(repo);
  });

  it('should update sender info', async () => {
    const result = await useCase.execute(1, { phoneNumber: '456' });
    expect(repo.findOneBy).toHaveBeenCalledWith({ id: 1 });
    expect(result.phoneNumber).toBe('456');
  });
});
