import { IsEnum, IsString, Length, IsNotEmpty, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsFile } from '@common/decorators/validator.decorator';
import { CHAIN } from '../coin.enum';

export class CreateNewCoinDto {
  @IsString()
  @Length(1, 100)
  @ApiProperty()
  name: string;

  @IsString()
  @Length(1, 100)
  @ApiProperty()
  symbol: string;

  // @IsString()
  // @Length(1, 256)
  // @IsFile({ mimeType: ['image/jpeg', 'image/jpg', 'image/png'] })
  @ApiProperty({ type: 'string', format: 'binary', required: true })
  logo: string;

  @ApiProperty()
  slug: string;

  @ApiProperty()
  description: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  chainId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  contractAddress: string;

  @ApiProperty()
  whitelistLink: string;

  @ApiProperty()
  launchDate: string;

  @ApiProperty()
  launchTime: string;

  @ApiProperty()
  presaleLink: string;

  @ApiProperty()
  presalePlatform: string;

  @ApiProperty()
  presaleTime: string;

  @ApiProperty()
  approvedAt: string;

  @ApiProperty()
  totalVotes: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  links: string;
}
