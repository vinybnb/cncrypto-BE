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
import { Throttle } from '@nestjs/throttler';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { ROLE } from 'src/enums/role.enum';
import { RolesGuard } from 'src/guards/roles.guard';
import { CoinsService } from './coins.service';
import { CustomThrottlerGuard } from './custom-throttler.guard';
import { AddPromotedToListDto } from './dtos/add-promoted-to-list.dto';
import { CreateNewCoinDto } from './dtos/create-new-coin.dto';

@Controller('coins')
export class CoinsController {
  constructor(private coinService: CoinsService) {}

  @Get()
  async getAllCoin(@Req() request: Request) {
    return await this.coinService.findAll(request.query);
  }

  @Get('/promoted')
  getPromotedCoin() {
    return this.coinService.getPromotedList();
  }

  @Post('/apply')
  createNewCoin(@Body() body: CreateNewCoinDto) {
    return this.coinService.create(body);
  }

  @UseGuards(CustomThrottlerGuard)
  @Throttle(1, 180)
  @Post('/:slug/vote')
  upVote(@Param('slug') slug: string) {
    return this.coinService.upVote(slug);
  }

  @Get('/:slug/approval')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.ADMIN)
  approveCoin(@Param('slug') slug: string) {
    return this.coinService.approveCoin(slug);
  }

  @Post('/:url/addPromote')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.ADMIN)
  addPromotedListCoin(
    @Param('url') url: string,
    @Body() body: AddPromotedToListDto,
  ) {
    return this.coinService.addPromotedListCoin(url, body);
  }

  @Delete('/promoted/:url')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.ADMIN)
  deleteCoinInPromotedList(@Param('url') url: string) {
    return this.coinService.deleteCoinInPromotedList(url);
  }
}
