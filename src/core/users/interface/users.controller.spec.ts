import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { CreateUserUseCase } from '../application/use-cases/create-user.use-case';
import { CreateUserDto } from '../application/dto/create-user.dto';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [CreateUserUseCase],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should create a user and return it', () => {
    const dto: CreateUserDto = {
      name: 'Jane',
      email: 'jane@mail.com',
    };

    const result = controller.create(dto);

    expect(result).toHaveProperty('id');
    expect(result.name).toBe('Jane');
    expect(result.email).toBe('jane@mail.com');
    expect(result.isActive).toBe(true);
  });
});
