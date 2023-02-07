import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';

import { CoinsService } from './promoted-list.service';
import { CoinsController } from './promoted-list.controller';
import { PromotedList as CoinEntity } from './promoted-list.entity';
import { CustomThrottlerGuard } from './custom-throttler.guard';
import { PromotedList as PromotedListEntity } from './promoted-list.entity';
import { HttpModule } from '@nestjs/axios';
import { PromotedList, PromotedListSchema } from './promoted-list.shema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: PromotedList.name, schema: PromotedListSchema }]),
    TypeOrmModule.forFeature([CoinEntity, PromotedListEntity]),
    HttpModule,
  ],
  providers: [CoinsService, CustomThrottlerGuard],
  controllers: [CoinsController],
})
export class CoinsModule {}
