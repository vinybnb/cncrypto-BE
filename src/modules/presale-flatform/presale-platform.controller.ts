import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ROLE } from 'src/common/enums/role.enum';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { CreatePresalePlatformDto } from './dtos/create-presale-platform.dto';
import { FilterPresalePlatformDto } from './dtos/filter-presale-platform.dto';
import { PresalePlatformIdDto } from './dtos/presale-platform-id.dto';
import { UpdatePresalePlatformDto } from './dtos/update-presale-platform.dto';
import { PresalePlatformService } from './presale-platform.service';

@ApiTags('Presale Platform')
@Controller('/api/presale-platform')
export class PresalePlatformController {
  constructor(private presalePlatformService: PresalePlatformService) {}

  @Get('/get-all')
  @UsePipes(new ValidationPipe({ transform: true }))
  getPromotedCoin(@Query() dto: FilterPresalePlatformDto) {
    return this.presalePlatformService.getAll(dto);
  }

  @Post('/create')
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.ADMIN)
  createPromoteCoin(@Body() dto: CreatePresalePlatformDto) {
    return this.presalePlatformService.create(dto);
  }

  @Get('/detail')
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.ADMIN)
  getPromotedCoinDetail(@Query() dto: PresalePlatformIdDto) {
    return this.presalePlatformService.getDetail(dto);
  }

  @Put('/update')
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.ADMIN)
  updatePromotedCoin(@Body() dto: UpdatePresalePlatformDto) {
    return this.presalePlatformService.update(dto);
  }

  @Delete('/delete')
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.ADMIN)
  deletePromotedCoin(@Query() dto: PresalePlatformIdDto) {
    return this.presalePlatformService.delete(dto);
  }
}
