import { InjectRepository } from '@nestjs/typeorm';
import { Message } from '../../../domain/entities/message.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GetAllMessagesUseCase {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,
  ) {}

  async execute() {
    return this.messageRepo.find({
      relations: ['contact', 'campaign'],
      order: { createdAt: 'DESC' },
    });
  }
}
