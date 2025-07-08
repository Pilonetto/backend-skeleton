import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SenderNumber } from '../../../domain/entities/sender-number.entity';
import { CreateSenderDto } from '../../dto/create-sender.dto';

@Injectable()
export class CreateSenderUseCase {
  constructor(
    @InjectRepository(SenderNumber)
    private readonly repo: Repository<SenderNumber>,
  ) {}

  async execute(dto: CreateSenderDto) {
    const sender = this.repo.create(dto);
    return this.repo.save(sender);
  }
}
