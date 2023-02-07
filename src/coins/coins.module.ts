import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';

import { CoinsService } from './coins.service';
import { CoinsController } from './coins.controller';
import { Coin as CoinEntity } from './coin.entity';
import { CustomThrottlerGuard } from './custom-throttler.guard';
import { PromotedList as PromotedListEntity } from '../promoted-list/promoted-list.entity';
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
    TypeOrmModule.forFeature([CoinEntity, PromotedListEntity]),
    HttpModule,
  ],
  providers: [CoinsService, CustomThrottlerGuard],
  controllers: [CoinsController],
})
export class CoinsModule {}
