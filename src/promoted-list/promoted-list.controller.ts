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
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { ROLE } from 'src/enums/role.enum';
import { RolesGuard } from 'src/guards/roles.guard';
import { PromotedService } from './promoted-list.service';
import { CustomThrottlerGuard } from './custom-throttler.guard';
import { AddPromotedToListDto } from './dtos/add-promoted-to-list.dto';

@Controller('/api/promoted')
export class PromotedController {
  constructor(private promotedService: PromotedService) {}

  @Get()
  getPromotedCoin() {
    return this.promotedService.getPromotedList();
  }

  @Post('/:url')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.ADMIN)
  addPromotedListCoin(
    @Param('url') url: string,
    @Body() body: AddPromotedToListDto,
  ) {
    return this.promotedService.addPromotedListCoin(url, body);
  }

  @Delete('/:url')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.ADMIN)
  deleteCoinInPromotedList(@Param('url') url: string) {
    return this.promotedService.deleteCoinInPromotedList(url);
  }
}
