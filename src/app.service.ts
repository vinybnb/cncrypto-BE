import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom, map } from 'rxjs';

@Injectable()
export class AppService {
  constructor(private httpService: HttpService) {}

  getHello(): string {
    return 'Hello World!';
  }

  async getListCoin(query) {
    const defaultQuery = {
      pageSize: 10,
      promote: false,
      watchlist: false,
      order: 'ASC',
      ama: false,
    };
    const finalQuery = Object.assign(query, defaultQuery);
    const http = this.httpService
      .get('https://api.moontok.io/api/coins', {
        params: finalQuery,
      })
      .pipe(map((res) => res.data));
    const data = await lastValueFrom(http);
    return data;
  }

  async getCoinBySlug(slug) {
    const http = this.httpService
      .get(
        `https://moontok.io/_next/data/cVQiqUzDnggxW3TirIYH2/zh/coins/${slug}.json?slug=${slug}`,
      )
      .pipe(map((res) => res.data));
    const data = await lastValueFrom(http);
    return data;
  }

  async getPromotedList() {
    const http = this.httpService
      .get('https://api.moontok.io/api/promote-content')
      .pipe(map((res) => res.data));
    const data = await lastValueFrom(http);
    return data;
  }

  async getCoinTickers() {
    const http = this.httpService
      .get(`https://api.moontok.io/api/coin-tickers`)
      .pipe(map((res) => res.data));
    const data = await lastValueFrom(http);
    return data;
  }

  async getCoinHighlights(query = { gainers: 24, trending: 2 }) {
    const http = this.httpService
      .get(`https://api.moontok.io/api/coin-highlights`, {
        params: query,
      })
      .pipe(map((res) => res.data));
    const data = await lastValueFrom(http);
    return data;
  }

  async getChains() {
    const http = this.httpService
      .get(`https://api.moontok.io/api/chains`)
      .pipe(map((res) => res.data));
    const data = await lastValueFrom(http);
    return data;
  }
}
