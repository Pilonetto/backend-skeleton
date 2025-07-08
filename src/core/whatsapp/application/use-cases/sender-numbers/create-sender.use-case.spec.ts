import { CreateSenderUseCase } from './create-sender.use-case';
import { Repository } from 'typeorm';
import { SenderNumber } from '../../../domain/entities/sender-number.entity';

// 🧪 Testa se o use-case cria e salva corretamente um sender number
describe('CreateSenderUseCase', () => {
  let useCase: CreateSenderUseCase;
  let repo: jest.Mocked<Repository<SenderNumber>>;

  beforeEach(() => {
    repo = {
      create: jest.fn((dto) => dto),
      save: jest.fn().mockResolvedValue({ id: 1 }),
    } as any;
    useCase = new CreateSenderUseCase(repo);
  });

  it('should create and save sender', async () => {
    const result = await useCase.execute({
      phoneNumber: '123',
      provider: 'official',
    });
    expect(repo.create).toHaveBeenCalled();
    expect(repo.save).toHaveBeenCalled();
    expect(result.id).toBe(1);
  });
});
