import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { CreateSenderUseCase } from '../../application/use-cases/sender-numbers/create-sender.use-case';
import { UpdateSenderUseCase } from '../../application/use-cases/sender-numbers/update-sender.use-case';
import { FindAllSendersUseCase } from '../../application/use-cases/sender-numbers/find-all-senders.use-case';
import { DeleteSenderUseCase } from '../../application/use-cases/sender-numbers/delete-sender.use-case';
import { CreateSenderDto } from '../../application/dto/create-sender.dto';
import { UpdateSenderDto } from '../../application/dto/update-sender.dto';
import { FetchTemplatesUseCase } from '../../application/use-cases/sender-numbers/fetch-templates.use-case';

@ApiTags('SenderNumbers')
@Controller('sender-numbers')
export class SenderNumberController {
  constructor(
    private readonly createUseCase: CreateSenderUseCase,
    private readonly updateUseCase: UpdateSenderUseCase,
    private readonly findAllUseCase: FindAllSendersUseCase,
    private readonly deleteUseCase: DeleteSenderUseCase,
    private readonly fetchTemplatesUseCase: FetchTemplatesUseCase,
  ) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Sender number created' })
  create(@Body() dto: CreateSenderDto) {
    return this.createUseCase.execute(dto);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'List of sender numbers' })
  findAll() {
    return this.findAllUseCase.execute();
  }

  @Put(':id')
  @ApiResponse({ status: 200, description: 'Sender number updated' })
  update(@Param('id') id: number, @Body() dto: UpdateSenderDto) {
    return this.updateUseCase.execute(+id, dto);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Sender number deleted' })
  delete(@Param('id') id: number) {
    return this.deleteUseCase.execute(+id);
  }

  @Get('/:id/templates')
  @ApiOperation({ summary: 'Lista templates da Meta para um número' })
  @ApiResponse({ status: 200, description: 'Lista de templates' })
  async getTemplates(@Param('id') id: string) {
    return this.fetchTemplatesUseCase.execute(id);
  }
}
