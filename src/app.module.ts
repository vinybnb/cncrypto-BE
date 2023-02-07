import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { CoinsModule } from './coins/coins.module';
import { Coin } from './coins/coin.entity';

import { UsersModule } from './users/users.module';
import { User } from './users/user.entity';
import { PromotedList } from './promoted-list/promoted-list.entity';
import { AuthModule } from './auth/auth.module';
import { ApiModule } from './api/api.module';
import { ChainModule } from './chains/chains.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGO_URI || 'mongodb://localhost:27017/china-crypto',
      { useUnifiedTopology: true },
    ),
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: process.env.MONGO_URI || 'mongodb://localhost:27017/china-crypto',
      entities: [Coin, User, PromotedList],
      useUnifiedTopology: true,
    }),
    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   host: 'localhost',
    //   port: 5432,
    //   username: 'postgres',
    //   password: 'postgres',
    //   database: 'china-crypto',
    //   entities: [Coin, User, PromotedList],
    //   synchronize: true,
    // }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
    CoinsModule,
    UsersModule,
    AuthModule,
    ApiModule,
    ChainModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
