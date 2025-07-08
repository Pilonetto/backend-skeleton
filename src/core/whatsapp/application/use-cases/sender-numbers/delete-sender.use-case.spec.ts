import { DeleteSenderUseCase } from './delete-sender.use-case';
import { Repository } from 'typeorm';
import { SenderNumber } from '../../../domain/entities/sender-number.entity';

// 🧪 Testa se o use-case remove corretamente um sender existente
describe('DeleteSenderUseCase', () => {
  let useCase: DeleteSenderUseCase;
  let repo: jest.Mocked<Repository<SenderNumber>>;

  beforeEach(() => {
    repo = {
      findOneBy: jest.fn().mockResolvedValue({ id: 1 }),
      remove: jest.fn().mockResolvedValue({ id: 1 }),
    } as any;
    useCase = new DeleteSenderUseCase(repo);
  });

  it('should delete a sender number', async () => {
    const result = await useCase.execute(1);
    expect(repo.findOneBy).toHaveBeenCalledWith({ id: 1 });
    expect(repo.remove).toHaveBeenCalled();
    expect(result.id).toBe(1);
  });
});
