import {
  IsString,
  IsEnum,
  IsNumberString,
  IsBooleanString,
  IsEmpty,
  IsNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsNullable } from '@common/decorators/validator.decorator';
import { Transform } from 'class-transformer';

export class FilterPromoteBannerDto {
  @IsBooleanString()
  @IsNullable()
  @ApiProperty({ required: false })
  unexpired: string;

  @IsString()
  @IsNullable()
  @ApiProperty({ required: false })
  sortBy: string;

  @IsEnum(['asc', 'desc'])
  @IsNullable()
  @ApiProperty({ required: false })
  sortDirection: string;

  @IsNumber()
  @IsNullable()
  @Transform(({ value }) => +value || 1)
  @ApiProperty({ required: false, type: 'number' })
  page = 1;

  @IsNumber()
  @IsNullable()
  @Transform(({ value }) => +value || 10)
  @ApiProperty({ required: false })
  pageSize = 10;
}
