import {
  IsEnum,
  IsOptional,
  IsString,
  IsInt,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSenderDto {
  @ApiProperty()
  @IsString()
  phoneNumber: string;

  @ApiProperty({ enum: ['official', 'unofficial'] })
  @IsEnum(['official', 'unofficial'])
  provider: 'official' | 'unofficial';

  @ApiProperty({ required: false, default: '' })
  @IsOptional()
  @IsString()
  wabaId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  token?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phoneNumberId?: string;

  @ApiProperty({ required: false, default: 3000 })
  @IsOptional()
  @IsInt()
  cadenceInMs?: number;

  @ApiProperty({ default: true })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
