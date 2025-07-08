import { CreateContactUseCase } from './create-contact.use-case';
import { Contact } from '../../../domain/entities/contact.entity';
import { Repository } from 'typeorm';

// 🧪 Testa se o use-case cria e salva corretamente um novo contato
describe('CreateContactUseCase', () => {
  let useCase: CreateContactUseCase;
  let repo: jest.Mocked<Repository<Contact>>;

  beforeEach(() => {
    repo = {
      create: jest.fn().mockImplementation((dto) => dto),
      save: jest
        .fn()
        .mockResolvedValue({ id: 1, name: 'Fulano', phone: '123' }),
    } as any;

    useCase = new CreateContactUseCase(repo);
  });

  it('should create and save a contact', async () => {
    const result = await useCase.execute({ name: 'Fulano', phone: '123' });
    expect(repo.create).toHaveBeenCalled();
    expect(repo.save).toHaveBeenCalled();
    expect(result.name).toBe('Fulano');
  });
});
