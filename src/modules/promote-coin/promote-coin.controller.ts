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
import { PromoteCoinService } from './promote-coin.service';
import { ApiTags } from '@nestjs/swagger';
import { CreatePromoteCoinDto } from './dtos/create-promote-coin.dto';
import { FilterPromoteCoinDto } from './dtos/filter-promote-coin.dto';
import { PromoteCoinIdDto } from './dtos/promote-coin-id.dto';
import { UpdatePromoteCoinDto } from './dtos/update-promote-coin.dto';

@ApiTags('Promoted Coin')
@Controller('/api/promote-coin')
export class PromoteCoinController {
  constructor(private promoteCoinService: PromoteCoinService) {}

  @Get('/get-all')
  @UsePipes(new ValidationPipe({ transform: true }))
  getPromotedCoin(@Query() dto: FilterPromoteCoinDto) {
    return this.promoteCoinService.getAllPromoteCoin(dto);
  }

  @Post('/create')
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.ADMIN)
  createPromoteCoin(@Body() dto: CreatePromoteCoinDto) {
    return this.promoteCoinService.createPromoteCoin(dto);
  }

  @Get('/detail')
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.ADMIN)
  getPromotedCoinDetail(@Query() dto: PromoteCoinIdDto) {
    return this.promoteCoinService.getDetailPromoteCoin(dto);
  }

  @Put('/update')
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.ADMIN)
  updatePromotedCoin(@Body() dto: UpdatePromoteCoinDto) {
    return this.promoteCoinService.updatePromoteCoin(dto);
  }

  @Delete('/delete')
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.ADMIN)
  deletePromotedCoin(@Query() dto: PromoteCoinIdDto) {
    return this.promoteCoinService.deletePromoteCoin(dto);
  }
}
