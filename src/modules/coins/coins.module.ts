import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { HttpModule } from '@nestjs/axios';
import {
  PromotedList,
  PromotedListSchema
} from '../promoted-list/promoted-list.shema';
import { Coin as CoinModel, CoinSchema } from './coin.shema';
import { CoinsController } from './coins.controller';
import { CoinsService } from './coins.service';
import { CustomThrottlerGuard } from './custom-throttler.guard';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CoinModel.name, schema: CoinSchema },
      { name: PromotedList.name, schema: PromotedListSchema },
    ]),
    HttpModule,
  ],
  providers: [CoinsService, CustomThrottlerGuard],
  controllers: [CoinsController],
})
export class CoinsModule {}
