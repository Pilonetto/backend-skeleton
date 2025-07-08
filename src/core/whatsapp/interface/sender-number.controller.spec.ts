// sender-number.controller.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { SenderNumberController } from './controllers/sender-number.controller';
import { CreateSenderUseCase } from '../application/use-cases/sender-numbers/create-sender.use-case';
import { UpdateSenderUseCase } from '../application/use-cases/sender-numbers/update-sender.use-case';
import { FindAllSendersUseCase } from '../application/use-cases/sender-numbers/find-all-senders.use-case';
import { DeleteSenderUseCase } from '../application/use-cases/sender-numbers/delete-sender.use-case';
import { CreateSenderDto } from '../application/dto/create-sender.dto';

describe('SenderNumberController', () => {
  let controller: SenderNumberController;

  const mockCreate = { execute: jest.fn() };
  const mockUpdate = { execute: jest.fn() };
  const mockFindAll = { execute: jest.fn() };
  const mockDelete = { execute: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SenderNumberController],
      providers: [
        { provide: CreateSenderUseCase, useValue: mockCreate },
        { provide: UpdateSenderUseCase, useValue: mockUpdate },
        { provide: FindAllSendersUseCase, useValue: mockFindAll },
        { provide: DeleteSenderUseCase, useValue: mockDelete },
      ],
    }).compile();

    controller = module.get<SenderNumberController>(SenderNumberController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // 🧪 Teste para criação de sender
  it('should create a sender', async () => {
    const dto: CreateSenderDto = {
      phoneNumber: '+5511999999999',
      provider: 'official',
      token: 'some-token-123',
      phoneNumberId: '1234567890',
      cadenceInMs: 3000,
      active: true,
    };
    await controller.create(dto);
    expect(mockCreate.execute).toHaveBeenCalledWith(dto);
  });

  // 🧪 Teste para buscar todos os senders
  it('should find all senders', async () => {
    await controller.findAll();
    expect(mockFindAll.execute).toHaveBeenCalled();
  });

  // 🧪 Teste para atualizar um sender
  it('should update a sender', async () => {
    const dto = { phoneNumber: '000' };
    await controller.update(1, dto);
    expect(mockUpdate.execute).toHaveBeenCalledWith(1, dto);
  });

  // 🧪 Teste para deletar um sender
  it('should delete a sender', async () => {
    await controller.delete(1);
    expect(mockDelete.execute).toHaveBeenCalledWith(1);
  });
});
