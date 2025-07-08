import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SenderNumber } from '../../../domain/entities/sender-number.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DeleteSenderUseCase {
  constructor(
    @InjectRepository(SenderNumber)
    private readonly repo: Repository<SenderNumber>,
  ) {}

  async execute(id: number) {
    const sender = await this.repo.findOneBy({ id });
    if (!sender) throw new NotFoundException('Sender not found');
    return this.repo.remove(sender);
  }
}
