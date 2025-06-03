import { CreateUserUseCase } from './create-user.use-case';

describe('CreateUserUseCase', () => {
  it('should create a user with name and email', () => {
    const useCase = new CreateUserUseCase();
    const user = useCase.execute({ name: 'John', email: 'john@mail.com' });

    expect(user).toHaveProperty('id');
    expect(user.name).toBe('John');
    expect(user.email).toBe('john@mail.com');
    expect(user.isActive).toBe(true);
  });
});
