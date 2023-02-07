import { Controller, Get } from '@nestjs/common';
import { Param, Query, Req } from '@nestjs/common/decorators';
import { Post } from '@nestjs/common/decorators/http/request-mapping.decorator';
import { Body } from '@nestjs/common/decorators/http/route-params.decorator';
import { Request } from 'express';
import { ChainService } from './chains.service';

@Controller('/api/chains')
export class ChainController {
  constructor(private readonly chainService: ChainService) {}

  @Get()
  getChains() {
    return this.chainService.getChains();
  }

  @Post()
  createChain(@Body() body) {
    return this.chainService.createChain(body);
  }
}
