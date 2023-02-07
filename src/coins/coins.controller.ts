import {
  Controller,
  Post,
  Body,
  Get,
  Req,
  Param,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { Query } from '@nestjs/common/decorators';
import { Throttle } from '@nestjs/throttler';
import { Request } from 'express';
import { firstValueFrom } from 'rxjs';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { ROLE } from 'src/enums/role.enum';
import { RolesGuard } from 'src/guards/roles.guard';
import { CoinsService } from './coins.service';
import { CustomThrottlerGuard } from './custom-throttler.guard';
import { CreateNewCoinDto } from './dtos/create-new-coin.dto';

@Controller('/api/coins')
export class CoinsController {
  constructor(private coinService: CoinsService) {}

  @Get()
  async getAllCoin(@Req() request: Request, @Query() query) {
    return await this.coinService.findAll(request.query);
  }

  @Get('/:slug')
  async getCoinBySlug(@Param('slug') slug: string) {
    return await this.coinService.getCoinBySlug(slug);
  }

  @Post()
  createNewCoin(@Body() body: CreateNewCoinDto) {
    return this.coinService.create(body);
  }

  @UseGuards(CustomThrottlerGuard)
  @Throttle(1, 180)
  @Post('/:slug/vote')
  upVote(@Param('slug') slug: string) {
    return this.coinService.upVote(slug);
  }

  @Post('/:slug/approval')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.ADMIN)
  approveCoin(@Param('slug') slug: string) {
    return this.coinService.approveCoin(slug);
  }

}
