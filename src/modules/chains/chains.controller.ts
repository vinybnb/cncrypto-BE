import { Controller, Get } from '@nestjs/common';
import { Param, Query, Req } from '@nestjs/common/decorators';
import { Post } from '@nestjs/common/decorators/http/request-mapping.decorator';
import { Body } from '@nestjs/common/decorators/http/route-params.decorator';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { ChainService } from './chains.service';
import { ChainDto } from './dto/chain.dto';

@ApiTags('Chains')
@Controller('/api/chains')
export class ChainController {
  constructor(private readonly chainService: ChainService) {}

  @Get()
  getChains() {
    return this.chainService.getChains();
  }

  @Post()
  @ApiConsumes('application/x-www-form-urlencoded')
  createChain(@Body() body: ChainDto) {
    return this.chainService.createChain(body);
  }
}
