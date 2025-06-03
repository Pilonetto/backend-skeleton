import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../../domain/user.entity';
import { v4 as uuid } from 'uuid';

export class CreateUserUseCase {
  execute(dto: CreateUserDto): User {
    const user = new User(uuid(), dto.name, dto.email);
    return user;
  }
}
