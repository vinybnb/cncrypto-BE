import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';

import { PromotedService } from './promoted-list.service';
import { PromotedController } from './promoted-list.controller';
import { CustomThrottlerGuard } from './custom-throttler.guard';
import { HttpModule } from '@nestjs/axios';
import { PromotedList, PromotedListSchema } from './promoted-list.shema';
import { Coin, CoinSchema } from '@/modules/coins/coin.shema';

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
