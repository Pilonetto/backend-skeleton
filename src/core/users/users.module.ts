import { Module } from '@nestjs/common';
import { UsersController } from './interface/users.controller';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';

@Module({
  controllers: [UsersController],
  providers: [CreateUserUseCase],
})
export class UsersModule {}
