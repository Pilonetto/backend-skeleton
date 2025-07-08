import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SenderNumber } from '../../../domain/entities/sender-number.entity';
import { UpdateSenderDto } from '../../dto/update-sender.dto';

@Injectable()
export class UpdateSenderUseCase {
  constructor(
    @InjectRepository(SenderNumber)
    private readonly repo: Repository<SenderNumber>,
  ) {}

  async execute(id: number, dto: UpdateSenderDto) {
    const sender = await this.repo.findOneBy({ id });
    if (!sender) throw new NotFoundException('Sender not found');
    return this.repo.save({ ...sender, ...dto });
  }
}
