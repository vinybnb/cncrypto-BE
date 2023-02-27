import { Controller, Get } from '@nestjs/common';
import { Post } from '@nestjs/common/decorators/http/request-mapping.decorator';
import { Body } from '@nestjs/common/decorators/http/route-params.decorator';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { ChainService } from './chains.service';
import { ChainDto } from './dto/chain.dto';

@ApiTags('Chains')
@Controller('/api/chains')
export class ChainController {
  constructor(private readonly chainService: ChainService) {}

  @Get('/get-all')
  getChains() {
    return this.chainService.getChains();
  }

  @Post('/create')
  @ApiConsumes('application/x-www-form-urlencoded')
  createChain(@Body() body: ChainDto) {
    return this.chainService.createChain(body);
  }
}
