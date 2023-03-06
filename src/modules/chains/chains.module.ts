import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChainController } from './chains.controller';
import { ChainService } from './chains.service';
import { HttpModule } from '@nestjs/axios';
import { Chain, ChainSchema } from './coin.shema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Chain.name, schema: ChainSchema }]),
    HttpModule,
  ],
  controllers: [ChainController],
  providers: [ChainService],
  exports: [ChainService],
})
export class ChainModule {}
