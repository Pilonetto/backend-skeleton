import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SenderNumber } from '../../../domain/entities/sender-number.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FindAllSendersUseCase {
  constructor(
    @InjectRepository(SenderNumber)
    private readonly repo: Repository<SenderNumber>,
  ) {}

  async execute() {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }
}
