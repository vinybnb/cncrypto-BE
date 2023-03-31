import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { HttpModule } from '@nestjs/axios';
import { PromoteBannerController } from './promote-banner.controller';
import { PromoteBannerService } from './promote-banner.service';
import { PromoteBanner, PromoteBannerSchema } from './promote-banner.shema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PromoteBanner.name, schema: PromoteBannerSchema },
    ]),
    HttpModule,
  ],
  providers: [PromoteBannerService],
  controllers: [PromoteBannerController],
})
export class PromoteBannerModule {}
