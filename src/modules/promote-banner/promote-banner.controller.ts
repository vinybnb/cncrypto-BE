import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  Delete,
  UsePipes,
  ValidationPipe,
  Query,
  Put,
} from '@nestjs/common';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ROLE } from 'src/common/enums/role.enum';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { PromoteBannerService } from './promote-banner.service';
import { ApiTags } from '@nestjs/swagger';
import { CreatePromoteBannerDto } from './dtos/create-promote-banner.dto';
import { FilterPromoteBannerDto } from './dtos/filter-promote-banner.dto';
import { PromoteBannerIdDto } from './dtos/promote-banner-id.dto';
import { UpdatePromoteBannerDto } from './dtos/update-promote-banner.dto';

@ApiTags('Promoted Banner')
@Controller('/api/promote-banner')
export class PromoteBannerController {
  constructor(private promoteBannerService: PromoteBannerService) {}

  @Get('/get-all')
  @UsePipes(new ValidationPipe({ transform: true }))
  getPromotedCoin(@Query() dto: FilterPromoteBannerDto) {
    return this.promoteBannerService.getAllPromoteBanner(dto);
  }

  @Post('/create')
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.ADMIN)
  createPromoteCoin(@Body() dto: CreatePromoteBannerDto) {
    return this.promoteBannerService.createPromoteBanner(dto);
  }

  @Get('/detail')
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.ADMIN)
  getPromotedCoinDetail(@Query() dto: PromoteBannerIdDto) {
    return this.promoteBannerService.getDetailPromoteBanner(dto);
  }

  @Put('/update')
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.ADMIN)
  updatePromotedCoin(@Body() dto: UpdatePromoteBannerDto) {
    return this.promoteBannerService.updatePromoteBanner(dto);
  }

  @Delete('/delete')
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.ADMIN)
  deletePromotedCoin(@Query() dto: PromoteBannerIdDto) {
    return this.promoteBannerService.deletePromoteBanner(dto);
  }
}
