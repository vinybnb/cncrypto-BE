import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Coin, CoinSchema } from '@/modules/coins/coin.shema';
import { HttpModule } from '@nestjs/axios';
import { CustomThrottlerGuard } from './custom-throttler.guard';
import { PromotedController } from './promoted-list.controller';
import { PromotedService } from './promoted-list.service';
import { PromotedList, PromotedListSchema } from './promoted-list.shema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Coin.name, schema: CoinSchema },
      { name: PromotedList.name, schema: PromotedListSchema },
    ]),
    HttpModule,
  ],
  providers: [PromotedService, CustomThrottlerGuard],
  controllers: [PromotedController],
})
export class PromotedModule {}
