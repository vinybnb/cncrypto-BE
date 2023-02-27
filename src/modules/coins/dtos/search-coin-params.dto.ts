import { IsString, Length, IsArray } from 'class-validator';

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

  @IsArray()
  chains: any[];

  whitelistLink: string;

  launchDate: string;

  launchTime: string;

  presaleLink: string;

  presalePlatform: string;

  presaleTime: string;

  approvedAt: string;

  totalVotes: string;

  status: string;

  links: string;
}
