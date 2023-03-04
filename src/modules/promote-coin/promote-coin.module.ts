import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Coin, CoinSchema } from '@/modules/coins/coin.shema';
import { HttpModule } from '@nestjs/axios';
import { PromoteCoinController } from './promote-coin.controller';
import { PromoteCoinService } from './promote-coin.service';
import { PromoteCoin, PromoteCoinSchema } from './promote-coin.shema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PromoteCoin.name, schema: PromoteCoinSchema },
    ]),
    HttpModule,
  ],
  providers: [PromoteCoinService],
  controllers: [PromoteCoinController],
})
export class PromoteCoinModule {}
