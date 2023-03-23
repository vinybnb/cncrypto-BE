import { Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ChainModule } from '@modules/chains/chains.module';
import { Chain, ChainSchema } from '@modules/chains/coin.shema';
import {
  PromoteCoin,
  PromoteCoinSchema,
} from '@modules/promote-coin/promote-coin.shema';
import { HttpModule } from '@nestjs/axios';
import {
  PromotedList,
  PromotedListSchema,
} from '../promoted-list/promoted-list.shema';
import { Coin, CoinSchema } from './coin.shema';
import { CoinsController } from './coins.controller';
import { CoinsService } from './coins.service';
import { CustomThrottlerGuard } from './custom-throttler.guard';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Coin.name, schema: CoinSchema },
      { name: Chain.name, schema: ChainSchema },
      { name: PromotedList.name, schema: PromotedListSchema },
      { name: PromoteCoin.name, schema: PromoteCoinSchema },
    ]),
    HttpModule,
    ChainModule,
  ],
  providers: [CoinsService, CustomThrottlerGuard, Logger],
  controllers: [CoinsController],
})
export class CoinsModule {}
