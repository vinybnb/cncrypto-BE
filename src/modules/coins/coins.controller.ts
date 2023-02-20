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
import { Patch, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiProduces,
  ApiTags,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Request } from 'express';
import { firstValueFrom } from 'rxjs';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ROLE } from 'src/common/enums/role.enum';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { CoinsService } from './coins.service';
import { CustomThrottlerGuard } from './custom-throttler.guard';
import { CoinDto } from './dtos/coin.dto';
import { CoinSlugDto } from './dtos/coin-slug.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { logoStorage } from '@common/helpers/storage.helper';

@ApiTags('Coins')
@ApiBearerAuth()
@Controller('/api/coins')
export class CoinsController {
  constructor(private coinService: CoinsService) {}

  @Get('/get-all')
  @ApiConsumes('application/x-www-form-urlencoded')
  async getAllCoin(@Req() request: Request, @Query() query) {
    return await this.coinService.findAll(request.query);
  }

  @Get('/detail')
  @ApiConsumes('application/x-www-form-urlencoded')
  async getCoinBySlug(@Query() query: CoinSlugDto) {
    return await this.coinService.getCoinBySlug(query.slug);
  }

  @Post('/create')
  @ApiConsumes('application/x-www-form-urlencoded')
  createNewCoin(@Body() body: CoinDto) {
    return this.coinService.create(body);
  }

  @UseGuards(CustomThrottlerGuard)
  @ApiConsumes('application/x-www-form-urlencoded')
  @Throttle(1, 180)
  @Post('/vote')
  upVote(@Body() body: CoinSlugDto) {
    return this.coinService.upVote(body.slug);
  }

  @Post('/approval')
  @ApiConsumes('application/x-www-form-urlencoded')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.ADMIN)
  approveCoin(@Body() body: CoinSlugDto) {
    return this.coinService.approveCoin(body.slug);
  }
}
