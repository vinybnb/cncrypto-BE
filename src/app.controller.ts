import { Controller, Get } from '@nestjs/common';
import { Param, Query, Req } from '@nestjs/common/decorators';
import { Request } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('coin')
  async getAllCoin(@Req() request: Request, @Query() query) {
    return await this.appService.getListCoin(query);
  }

  @Get('coin/:slug')
  getCoinDetail(@Param('slug') slug: string) {
    return this.appService.getCoinBySlug(slug);
  }

  @Get('/promote-content')
  getPromotedCoin() {
    return this.appService.getPromotedList();
  }

  @Get('/coin-tickers')
  getCoinTickers() {
    return this.appService.getCoinTickers();
  }

  @Get('/coin-highlights')
  getCoinHighlights(@Query() query) {
    return this.appService.getCoinHighlights(query);
  }

  @Get('/chains')
  getChains() {
    return this.appService.getChains();
  }

}
