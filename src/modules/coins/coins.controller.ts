import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Delete,
  UploadedFile,
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
import { VoteCoinDto } from './dtos/vote-coin.dto';
import { HttpCode, Put, UseInterceptors } from '@nestjs/common/decorators';
import { UpdateCoinDto } from './dtos/update-coin.dto';
import { UpdateImageCoinDto } from './dtos/update-image-coin.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Coins')
@ApiBearerAuth()
@Controller('/api/coins')
export class CoinsController {
  constructor(private coinService: CoinsService) {}

  @Get('/get-all')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getAllCoin(@Query() query: FilterCoinDto) {
    return await this.coinService.findAll(query);
  }

  @Get('/detail')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getCoinBySlug(@Query() query: CoinSlugDto) {
    return await this.coinService.getCoinBySlug(query.slug);
  }

  @Post('/create')
  @UsePipes(new ValidationPipe({ transform: true }))
  createNewCoin(@Body() body: CreateCoinDto) {
    return this.coinService.create(body);
  }

  @Put('/update')
  @UsePipes(new ValidationPipe({ transform: true }))
  UpdateCoin(@Body() body: UpdateCoinDto) {
    return this.coinService.update(body);
  }

  @Put('/update-image')
  @ApiConsumes('multipart/form-data')
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseInterceptors(FileInterceptor('logo'))
  UpdateImage(
    @Body() body: UpdateImageCoinDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.coinService.updateImage(body, file);
  }

  @Delete('/delete')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.ADMIN)
  deleteCoin(@Query() query: CoinSlugDto) {
    return this.coinService.deleteCoinBySlug(query.slug);
  }

  @UseGuards(CustomThrottlerGuard)
  @Throttle(10, 60)
  @Post('/vote')
  upVote(@Body() body: VoteCoinDto) {
    return this.coinService.upVote(body);
  }

  @Post('/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.ADMIN)
  approveCoin(@Body() body: CoinSlugDto) {
    return this.coinService.approveCoin(body.slug);
  }

  @Post('/unapproved')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.ADMIN)
  unapprovedCoin(@Body() body: CoinSlugDto) {
    return this.coinService.unApproveCoin(body.slug);
  }

  @Post('/check')
  @HttpCode(200)
  checkCoinExist(@Body() body: CreateCoinDto) {
    return this.coinService.checkCoinExist(body);
  }
}
