import { IsNullable } from '@common/decorators/validator.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsString } from 'class-validator';

export class FilterPresalePlatformDto {
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
