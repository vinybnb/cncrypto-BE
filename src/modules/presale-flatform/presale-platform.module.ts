import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { HttpModule } from '@nestjs/axios';
import { PresalePlatformController } from './presale-platform.controller';
import { PresalePlatformService } from './presale-platform.service';
import {
  PresalePlatform,
  PresalePlatformSchema,
} from './presale-platform.shema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PresalePlatform.name, schema: PresalePlatformSchema },
    ]),
    HttpModule,
  ],
  providers: [PresalePlatformService],
  controllers: [PresalePlatformController],
})
export class PresalePlatformModule {}
