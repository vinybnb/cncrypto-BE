import { IsEnum, IsString, Length, IsNotEmpty } from 'class-validator';
import { CHAIN } from '../coin.enum';

export class CreateNewCoinDto {
  @IsString()
  @Length(1, 100)
  name: string;

  @IsString()
  @Length(1, 100)
  symbol: string;

  @IsString()
  @Length(1, 256)
  logo: string;

  description: string;

  @IsEnum(CHAIN)
  chain: string;

  @IsNotEmpty()
  contractAddress: string;

  whitelistLink: string;

  presaleLink: string;

  presalePlatform: string;

  @IsNotEmpty()
  presaleTime: string;

  @IsNotEmpty()
  launchTime: string;

  @IsNotEmpty()
  launchPlatform: string;

  @IsNotEmpty()
  launchLink: string;

  contactEmail: string;

  contactTelegram: string;

  kyc: string;

  audit: string;

  website: string;

  discord: string;

  @IsNotEmpty()
  telegram: string;

  twitter: string;

  telegram_cn: string;

  btok: string;
}
