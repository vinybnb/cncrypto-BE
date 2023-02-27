import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Query } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ROLE } from 'src/common/enums/role.enum';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { CoinsService } from './coins.service';
import { CustomThrottlerGuard } from './custom-throttler.guard';
import { CreateCoinDto } from './dtos/create-coin.dto';
import { CoinSlugDto } from './dtos/coin-slug.dto';
import { FilterCoinDto } from './dtos/filter-coin.dto';

@ApiTags('Coins')
@ApiBearerAuth()
@Controller('/api/coins')
export class CoinsController {
  constructor(private coinService: CoinsService) {}

  @Get('/get-all')
  @ApiConsumes('application/x-www-form-urlencoded')
  async getAllCoin(@Query() query: FilterCoinDto) {
    return await this.coinService.findAll(query);
  }

  @Get('/detail')
  @ApiConsumes('application/x-www-form-urlencoded')
  async getCoinBySlug(@Query() query: CoinSlugDto) {
    return await this.coinService.getCoinBySlug(query.slug);
  }

  @Post('/create')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiConsumes('application/x-www-form-urlencoded')
  createNewCoin(@Body() body: CreateCoinDto) {
    return this.coinService.create(body);
  }

  @UseGuards(CustomThrottlerGuard)
  @ApiConsumes('application/x-www-form-urlencoded')
  @Throttle(1, 180)
  @Post('/vote')
  upVote(@Body() body: CoinSlugDto) {
    return this.coinService.upVote(body.slug);
  }

  @Post('/approve')
  @ApiConsumes('application/x-www-form-urlencoded')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.ADMIN)
  approveCoin(@Body() body: CoinSlugDto) {
    return this.coinService.approveCoin(body.slug);
  }
}
