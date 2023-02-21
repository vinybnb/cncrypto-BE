import {
  IsString,
  IsNumber,
  IsEnum,
  IsBoolean,
  ValidateIf,
  IsNumberString,
  IsBooleanString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsNullable } from '@common/decorators/validator.decorator';

export class FilterCoinDto {
  @IsString()
  @IsNullable()
  @ApiProperty({ required: false })
  slug: string;

  @IsNumberString()
  @IsNullable()
  @ApiProperty({ required: false })
  chainId: number;

  @IsBooleanString()
  @IsNullable()
  @ApiProperty({ required: false })
  approved: 'true' | 'false';

  @IsBooleanString()
  @IsNullable()
  @ApiProperty({ required: false })
  promoted: string;

  @IsString()
  @IsNullable()
  @ApiProperty({ required: false })
  search: string;

  @IsString()
  @IsNullable()
  @ApiProperty({ required: false })
  sortBy: string;

  @IsEnum(['asc', 'desc'])
  @IsNullable()
  @ApiProperty({ required: false })
  sortDirection: string;

  // @IsNumberString()
  @IsNullable()
  @ApiProperty({ required: false, type: 'number' })
  page: number = 1;

  // @IsNumberString()
  @IsNullable()
  @ApiProperty({ required: false })
  pageSize: number = 10;
}
