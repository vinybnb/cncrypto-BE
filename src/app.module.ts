import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { CoinsModule } from './coins/coins.module';
import { Coin } from './coins/coin.entity';

import { UsersModule } from './users/users.module';
import { User } from './users/user.entity';
import { PromotedList } from './coins/promoted-list.entity';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    // TypeOrmModule.forRoot({
    //   type: 'sqlite',
    //   database: 'test.sqlite',
    //   entities: [Coin],
    //   synchronize: true,
    // }),
    TypeOrmModule.forRoot({
      type: 'mongodb',
      host: 'localhost',
      port: 27017,
      database: 'china-crypto',
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
