import { Test, TestingModule } from '@nestjs/testing';
import { ContactController } from './contact.controller';
import { CreateContactUseCase } from '../../application/use-cases/campaigns/create-contact.use-case';
import { CreateContactDto } from '../../application/dto/create-contact.dto';

// 🧪 Este teste verifica se o controller chama o use-case corretamente ao criar um contato
describe('ContactController', () => {
  let controller: ContactController;
  let useCase: CreateContactUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContactController],
      providers: [
        {
          provide: CreateContactUseCase,
          useValue: {
            execute: jest
              .fn()
              .mockResolvedValue({ id: 1, name: 'João', phone: '123' }),
          },
        },
      ],
    }).compile();

    controller = module.get(ContactController);
    useCase = module.get(CreateContactUseCase);
  });

  it('should call use case and return created contact', async () => {
    const dto: CreateContactDto = { name: 'João', phone: '123' };
    const result = await controller.create(dto);

    expect(useCase.execute).toHaveBeenCalledWith(dto);
    expect(result).toEqual({ id: 1, name: 'João', phone: '123' });
  });
});
