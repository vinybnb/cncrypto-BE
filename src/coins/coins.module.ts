import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CoinsService } from './coins.service';
import { CoinsController } from './coins.controller';
import { Coin } from './coin.entity';
import { CustomThrottlerGuard } from './custom-throttler.guard';
import { PromotedList } from './promoted-list.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([Coin, PromotedList]), HttpModule],
  providers: [CoinsService, CustomThrottlerGuard],
  controllers: [CoinsController],
})
export class CoinsModule {}
