import { Controller, Get } from '@nestjs/common';
import { Param, Query, Req } from '@nestjs/common/decorators';
import { Request } from 'express';
import { ApiService } from './api.service';

@Controller('/api')
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  @Get()
  getHello(): string {
    return this.apiService.getHello();
  }

  @Get('coin')
  async getAllCoin(@Req() request: Request, @Query() query) {
    return await this.apiService.getListCoin(query);
  }

  @Get('coin/:slug')
  getCoinDetail(@Param('slug') slug: string) {
    return this.apiService.getCoinBySlug(slug);
  }

  @Get('/promote-content')
  getPromotedCoin() {
    return this.apiService.getPromotedList();
  }

  @Get('/coin-tickers')
  getCoinTickers() {
    return this.apiService.getCoinTickers();
  }

  @Get('/coin-highlights')
  getCoinHighlights(@Query() query) {
    return this.apiService.getCoinHighlights(query);
  }

  @Get('/chains')
  getChains() {
    return this.apiService.getChains();
  }

}
