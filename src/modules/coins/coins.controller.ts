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
import { CreateNewCoinDto } from './dtos/create-new-coin.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { logoStorage } from 'src/common/helpers/storage.helper';

@ApiTags('Coins')
@ApiBearerAuth()
@Controller('/api/coins')
export class CoinsController {
  constructor(private coinService: CoinsService) {}

  @Get()
  async getAllCoin(@Req() request: Request, @Query() query) {
    return await this.coinService.findAll(request.query);
  }

  @Get('/:slug/detail')
  async getCoinBySlug(@Param('slug') slug: string) {
    return await this.coinService.getCoinBySlug(slug);
  }

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('logo', { storage: logoStorage }))
  createNewCoin(
    @Body() body: CreateNewCoinDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    body.logo = file.filename;
    return this.coinService.create(body);
  }

  @Post('/:slug/logo')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('logo'))
  async updateCoinLogo(
    @Param('slug') slug: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() body,
  ) {
    console.log(typeof file, file);
    console.log(body);
    return await this.coinService.updateCoinLogoBySlug(slug, file);
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
