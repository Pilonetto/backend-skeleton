import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from '../../users/application/dto/create-user.dto';
import { CreateUserUseCase } from '../../users/application/use-cases/create-user.use-case';
import { ApiTags, ApiResponse } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly useCase: CreateUserUseCase) {}

  @Post()
  @ApiResponse({ status: 201, description: 'User created' })
  create(@Body() dto: CreateUserDto) {
    return this.useCase.execute(dto);
  }
}
