import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MONGO_URI } from './configs/database';

import { CoinsModule } from '@/modules/coins/coins.module';

import { UsersModule } from '@modules/users/users.module';
import { AuthModule } from '@modules/auth/auth.module';
import { ApiModule } from '@modules/api/api.module';
import { ChainModule } from '@modules/chains/chains.module';
import { PromotedModule } from '@modules/promoted-list/promoted-list.module';
import { MongooseModule } from '@nestjs/mongoose';
import { PromoteBannerModule } from '@modules/promote-banner/promote-banner.module';
import { PromoteCoinModule } from '@modules/promote-coin/promote-coin.module';

@Module({
  imports: [
    MongooseModule.forRoot(MONGO_URI, { useUnifiedTopology: true }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, 'public'),
    // }),
    CoinsModule,
    UsersModule,
    AuthModule,
    ApiModule,
    ChainModule,
    PromotedModule,
    PromoteBannerModule,
    PromoteCoinModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
