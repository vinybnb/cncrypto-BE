import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ROLE } from 'src/common/enums/role.enum';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { PromotedService } from './promoted-list.service';
import { AddPromotedToListDto } from './dtos/add-promoted-to-list.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Promoted List')
@Controller('/api/promoted')
export class PromotedController {
  constructor(private promotedService: PromotedService) {}

  @Get('/get-all')
  getPromotedCoin() {
    return this.promotedService.getPromotedList();
  }

  @Post('/create')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.ADMIN)
  createPromoteCoin(
    @Param('url') url: string,
    @Body() body: AddPromotedToListDto,
  ) {
    return this.promotedService.addPromotedListCoin(url, body);
  }

  @Post('/detail')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.ADMIN)
  getPromotedCoinDetail(
    @Param('url') url: string,
    @Body() body: AddPromotedToListDto,
  ) {
    return this.promotedService.addPromotedListCoin(url, body);
  }

  @Post('/update')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.ADMIN)
  updatePromotedCoin(
    @Param('url') url: string,
    @Body() body: AddPromotedToListDto,
  ) {
    return this.promotedService.addPromotedListCoin(url, body);
  }

  @Delete('/:url')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.ADMIN)
  deletePromotedCoin(@Param('url') url: string) {
    return this.promotedService.deleteCoinInPromotedList(url);
  }
}
