import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';

import { CoinsService } from './coins.service';
import { CoinsController } from './coins.controller';
import { CustomThrottlerGuard } from './custom-throttler.guard';
import { HttpModule } from '@nestjs/axios';
import { Coin, CoinSchema } from './coin.shema';
import {
  PromotedList,
  PromotedListSchema,
} from '../promoted-list/promoted-list.shema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Coin.name, schema: CoinSchema },
      { name: PromotedList.name, schema: PromotedListSchema },
    ]),
    HttpModule,
  ],
  providers: [CoinsService, CustomThrottlerGuard],
  controllers: [CoinsController],
})
export class CoinsModule {}
