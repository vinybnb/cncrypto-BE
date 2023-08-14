import { toSlug } from '@common/helpers/string.helper';
import {
  API_TOKEN_TWITTER,
  BOT_TOKEN_TELEGRAM,
  RECAPTCHA_SECRET_KEY,
} from '@configs/app';
import { ChainService } from '@modules/chains/chains.service';
import {
  PromoteCoin,
  PromoteCoinDocument,
} from '@modules/promote-coin/promote-coin.shema';
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common/exceptions';
import { InjectModel } from '@nestjs/mongoose';
import { plainToClass } from 'class-transformer';
import { Model, PipelineStage } from 'mongoose';
import { lastValueFrom, map } from 'rxjs';
import { STATUS } from './coin.enum';
import { Coin, CoinDocument } from './coin.shema';
import { CreateCoinDto } from './dtos/create-coin.dto';
import { FilterCoinDto } from './dtos/filter-coin.dto';
import { ResponseCoinDto } from './dtos/response-coin.dto';
import { UpdateCoinDto } from './dtos/update-coin.dto';
import { VoteCoinDto } from './dtos/vote-coin.dto';
import TelegramBot from 'node-telegram-bot-api';
import { UpdateImageCoinDto } from './dtos/update-image-coin.dto';

@Injectable()
export class CoinsService {
  constructor(
    @InjectModel(Coin.name) private coinModel: Model<CoinDocument>,
    @InjectModel(PromoteCoin.name)
    private promoteCoinModel: Model<PromoteCoinDocument>,
    private chainService: ChainService,
    private readonly httpService: HttpService,
    private readonly logger: Logger,
  ) {}

  async findAll(filterDto: FilterCoinDto) {
    const {
      chainId,
      approved,
      promoted,
      listingType,
      filter,
      search = '',
      sortBy = 'createdAt',
      sortDirection = 'desc',
      page = 1,
      pageSize = 10,
    } = filterDto;

    const pipeline: PipelineStage[] = [];

    pipeline.push({
      $addFields: {
        change1h: { $toDouble: '$change1h' },
        change6h: { $toDouble: '$change6h' },
        change24h: { $toDouble: '$change24h' },
        volume24h: { $toDouble: '$volume24h' },
        liquidityUsdNumber: { $toDouble: '$liquidityUsd' },
        volume24hNumber: { $toDouble: '$volume24h' },
      },
    });

    pipeline.push({
      $addFields: {
        trending: {
          $cond: [
            {
              $or: [
                { $eq: ['$liquidityUsdNumber', 0] },
                { $eq: ['$liquidityUsdNumber', null] },
                { $eq: ['$volume24hNumber', 0] },
                { $eq: ['$volume24hNumber', null] },
              ],
            },
            0,
            { $divide: ['$volume24hNumber', '$liquidityUsdNumber'] },
          ],
        },
      },
    });

    if (sortBy === 'trending') {
      pipeline.push({ $match: { volume24hNumber: { $gt: 10000 } } });
    }

    pipeline.push({ $unset: ['volume24hNumber', 'liquidityUsdNumber'] });

    if (search) {
      pipeline.push({
        $match: {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { symbol: { $regex: search, $options: 'i' } },
            {
              'chains.contractAddress': {
                $regex: `^${search}$`,
                $options: 'i',
              },
            },
          ],
        },
      });
    }

    if (chainId && chainId !== -1) {
      pipeline.push({
        $match: { chains: { $elemMatch: { chainId: +chainId } } },
      });
    }

    if (approved === 'false') {
      pipeline.push({ $match: { approvedAt: null } });
    }

    if (approved === 'true') {
      pipeline.push({ $match: { approvedAt: { $ne: null } } });
    }

    if (listingType?.length > 0) {
      pipeline.push({ $match: { listingType: { $eq: listingType } } });
    }

    if (filter) {
      const matchClause: any = {};
      for (const key in filter) {
        const matchField = {};
        for (const opKey in filter[key]) {
          let value = filter[key][opKey];
          const dateColumns = [
            'whitelistAt',
            'launchAt',
            'presaleStartAt',
            'presaleEndAt',
            'approvedAt',
            'createdAt',
            'updatedAt',
          ];
          if (dateColumns.includes(key)) {
            value = new Date(filter[key][opKey]);
          }
          matchField['$' + opKey?.replace(/^\$/g, '')] = value;
        }
        matchClause[key] = matchField;
      }
      pipeline.push({
        $match: matchClause,
      });
    }

    if (promoted === 'true') {
      const now = new Date().toISOString();
      const promoted = await this.promoteCoinModel.find(
        { expiredAt: { $gte: now } },
        { coin: 1 },
      );
      pipeline.push({
        $match: { _id: { $in: promoted?.map((item) => item?.coin) } },
      });
    }

    const countAggregate = await this.coinModel.aggregate([
      ...pipeline,
      { $count: 'count' },
    ]);
    const count = countAggregate?.[0]?.count || 0;

    pipeline.push({
      $lookup: {
        from: 'presale-platform',
        localField: 'presalePlatform',
        foreignField: '_id',
        as: 'presalePlatform',
      },
    });
    pipeline.push({
      $addFields: {
        presalePlatform: { $arrayElemAt: ['$presalePlatform', 0] },
      },
    });
    pipeline.push({
      $sort: { [sortBy]: sortDirection.toLowerCase() === 'asc' ? 1 : -1 },
    });
    pipeline.push({ $skip: (page - 1) * pageSize });
    pipeline.push({ $limit: +pageSize });

    const coins = await this.coinModel.aggregate(pipeline);

    // add chain info to coins result
    const objChains = await this.chainService.getObjectByChainId();

    const resultCoins = coins.map((item) => ({
      ...item,
      chains: item?.chains.map((chain) => ({
        ...chain,
        chain: objChains[chain.chainId],
      })),
    }));

    return {
      currentPage: +page,
      totalPage: Math.ceil(count / pageSize),
      totalItem: count,
      data: resultCoins.map((item) => plainToClass(ResponseCoinDto, item)),
    };
  }

  async getCoinBySlug(slug) {
    const pipeline = [];

    pipeline.push({
      $lookup: {
        from: 'presale-platform',
        localField: 'presalePlatform',
        foreignField: '_id',
        as: 'presalePlatform',
      },
    });
    pipeline.push({
      $addFields: {
        presalePlatform: { $arrayElemAt: ['$presalePlatform', 0] },
      },
    });
    pipeline.push({ $match: { slug } });
    pipeline.push({ $limit: 1 });

    const coins = await this.coinModel.aggregate(pipeline);
    const coin = coins?.[0] ? coins[0] : null;

    // add chain info to coin result
    const objChains = await this.chainService.getObjectByChainId();

    const resultCoin = {
      ...coin,
      chains: coin.chains?.map((chain) => ({
        ...chain,
        chain: objChains[chain.chainId],
      })),
    };

    return { data: plainToClass(ResponseCoinDto, resultCoin) };
  }

  async create(dto: CreateCoinDto) {
    // const maxIdCoin = await this.coinRepo

    const check = await this.checkCoinExist(dto);

    if (check.isExist) {
      throw new BadRequestException(
        `contract address is exist in ${check?.data?.slug}`,
      );
    }

    const maxIdCoin = await this.coinModel.findOne({}).sort({ id: -1 });

    dto.id = (+maxIdCoin?.id || 0) + 1;
    const slug = toSlug(dto?.name);

    let countBySLug = await this.coinModel.count({ slug: slug });

    if (countBySLug > 0) {
      while (true) {
        countBySLug++;
        const isExistBySlug = await this.coinModel.exists({
          slug: slug + '-' + countBySLug,
        });
        if (!isExistBySlug) {
          break;
        }
      }
      dto.slug = slug + '-' + countBySLug;
    } else {
      dto.slug = slug;
    }

    for (const chain of dto.chains) {
      try {
        const tokenInfo = await this.getTokenInfo(chain.contractAddress);
        dto.price = tokenInfo?.priceUsd;
        dto.liquidityUsd = tokenInfo?.liquidity?.usd || 0;
        dto.volume24h = tokenInfo?.volume.h24;
        dto.volume6h = tokenInfo?.volume.h6;
        dto.volume1h = tokenInfo?.volume.h24;
        dto.change24h = tokenInfo?.priceChange.h24;
        dto.change6h = tokenInfo?.priceChange.h6;
        dto.change1h = tokenInfo?.priceChange.h24;
        break;
      } catch (error) {}
    }

    if (Array.isArray(dto.links)) {
      const linksWIthSocialCountPromise = dto.links.map(async (item) => {
        try {
          if (item?.name?.toUpperCase()?.includes('TELEGRAM')) {
            const socialCount = await this.getChatMembersCountTelegram(
              item.link,
            );
            return { ...item, socialCount };
          }
          if (item?.name?.toUpperCase()?.includes('TWITTER')) {
            const socialCount = await this.getFollowCountTwitter(item.link);
            return { ...item, socialCount };
          }
        } catch (error) {
          this.logger.error(
            error?.message,
            'linksWIthSocialCount ' + item.link,
          );
        }
        return item;
      });
      dto.links = await Promise.all(linksWIthSocialCountPromise);
    }

    const coin = await this.coinModel.create(dto);

    return { data: coin };
  }

  async update(dto: UpdateCoinDto) {
    delete dto.id;
    delete dto.slug;

    for (const chain of dto.chains || []) {
      try {
        const tokenInfo = await this.getTokenInfo(chain.contractAddress);
        dto.price = tokenInfo?.priceUsd;
        dto.liquidityUsd = tokenInfo?.liquidity?.usd || 0;
        dto.volume24h = tokenInfo?.volume.h24;
        dto.volume6h = tokenInfo?.volume.h6;
        dto.volume1h = tokenInfo?.volume.h24;
        dto.change24h = tokenInfo?.priceChange.h24;
        dto.change6h = tokenInfo?.priceChange.h6;
        dto.change1h = tokenInfo?.priceChange.h24;
        break;
      } catch (error) {}
    }

    if (Array.isArray(dto.links)) {
      const linksWIthSocialCountPromise = dto.links.map(async (item) => {
        try {
          if (item?.name?.toUpperCase()?.includes('TELEGRAM')) {
            const socialCount = await this.getChatMembersCountTelegram(
              item.link,
            );
            return { ...item, socialCount };
          }
          if (item?.name?.toUpperCase()?.includes('TWITTER')) {
            const socialCount = await this.getFollowCountTwitter(item.link);
            return { ...item, socialCount };
          }
        } catch (error) {
          this.logger.error(
            error?.message,
            'linksWIthSocialCountPromise ' + item.link,
          );
        }
        return item;
      });
      dto.links = await Promise.all(linksWIthSocialCountPromise);
    }

    await this.coinModel.updateOne({ _id: dto._id }, dto);

    return { result: 'success' };
  }

  async updateImage(dto: UpdateImageCoinDto, fileLogo: Express.Multer.File) {
    console.log(dto, fileLogo);
    return { result: 'success' };
  }

  async updateCoinLogoBySlug(slug: string, file: Express.Multer.File) {
    console.log(file);
    const coin = await this.coinModel.findOne({ slug });
    return { data: coin };
  }

  async deleteCoinBySlug(slug: string) {
    await this.coinModel.deleteOne({ slug: slug });
    return { result: 'success' };
  }

  async checkCoinExist(dto: CreateCoinDto) {
    const findClause = [];

    for (const chain of dto.chains) {
      findClause.push({
        'chains.chainId': chain.chainId,
        'chains.contractAddress': chain.contractAddress,
      });
    }

    const coin = await this.coinModel.findOne({ $or: findClause });

    return { isExist: !!coin, data: coin };
  }

  async upVote(dto: VoteCoinDto) {
    const VERIFY_URL = `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET_KEY}&response=${dto.recaptchaToken}`;

    const http = this.httpService.post(VERIFY_URL).pipe(map((res) => res.data));
    const data = await lastValueFrom(http);

    if (!data.success) {
      throw new BadRequestException('Recaptcha token is wrong');
    }

    await this.coinModel.updateOne(
      { slug: dto.slug },
      { $inc: { totalVotes: 1 } },
    );
    return { result: 'success' };
  }

  async approveCoin(slug) {
    const coin = await this.coinModel.findOne({ slug });

    coin.status = STATUS.APPROVED;
    coin.approvedAt = new Date();
    await coin.save();

    const objChains = await this.chainService.getObjectByChainId();

    const resultCoin: any = {
      ...coin.toObject(),
      chains: coin.toObject().chains?.map((chain) => ({
        ...chain,
        chain: objChains[chain.chainId],
      })),
    };

    const tokenTelegramBot = '6134109204:AAHhiTQ-4hsJhTXZAc9s4gpQpz9qMlKSrvs';

    const botTelegram = new TelegramBot(tokenTelegramBot, {
      // polling: true,
      parse_mode: 'Markdown',
    });

    const message = `
<b>⚡️ <a href="https://CNCrypto.io">CNCrypto.io</a> ——通知上市 | <a href="https://CNCrypto.io">CNCrypto.io</a> Listing Alert${
      !resultCoin?.premium ? ' (Free)' : ''
    } - ${resultCoin?.chains[0]?.chain.scanKey.toLocaleUpperCase()}</b>

<b>代币 Coin:</b> <a href="https://CNCrypto.io/coin/${resultCoin?.slug}">${
      resultCoin?.name
    }</a>${
      resultCoin?.links?.find((item) => item?.name?.includes('TELEGRAM')) &&
      ` | <a href="${
        resultCoin?.links?.find((item) => item?.name?.includes('TELEGRAM')).link
      }"><b>电报群 Telegram (英) </b></a>`
    }
${resultCoin?.chains
  ?.map(
    (item) =>
      `\n<b>合约 Contract ${item?.chain.scanKey.toLocaleUpperCase()}:</b>  ${
        item?.contractAddress
      }`,
  )
  .join('')}
${
  resultCoin?.presaleLink
    ? `<b>\n买 Buy: </b> <a href="${resultCoin?.presaleLink}">${resultCoin?.presaleLink}</a>`
    : `<b>\n图表 Chart:</b> <a href="https://CNCrypto.io/coin/${
        resultCoin?.slug
      }">https://CNCrypto.io/coin/${resultCoin?.slug}</a>
<b>\n池子 Liquidity / 市值 MarketCap: </b> $${Number(
        resultCoin.liquidityUsd,
      ).toLocaleString('en')} / $${Number(resultCoin.marketCap).toLocaleString(
        'en',
      )}`
}

<a href="https://CNCrypto.io/"><b>CNCrypto.io:</b></a>
<a href="https://t.me/cncrypto_io">Channel</a> | <a href="https://t.me/cncrypto_chat">Group</a> | <a href="https://twitter.com/cncrypto_io">Twitter</a>

<a href="https://cncrypto.io/privacy-policy">免责声明</a>
      `;

    const chatId = '-1001843683844';

    if (coin?.premium) {
      botTelegram.sendPhoto(chatId, resultCoin?.logo, {
        caption: message,
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: '🚀 CX/Shill',
                url: `https://twitter.com/intent/tweet?via=cncrypto_io&text=%F0%9F%91%91%20Vote%20for%20${
                  resultCoin?.name
                }%20%40${
                  resultCoin?.links?.find((item) =>
                    item?.name?.includes('TWITTER'),
                  ) &&
                  `${resultCoin?.links
                    ?.find((item) => item?.name?.includes('TWITTER'))
                    .link.replace('https://twitter.com/', '')}`
                }%20at%20https://cncrypto.io/coin/${
                  resultCoin?.slug
                }%20%2C%20the%20most%20powerful%20Chinese%20coin%20index%20platform%21%21%0A%0ALets%20take%20it%20to%20the%20moon%21%F0%9F%8C%95%20%0A%0A&hashtags=${
                  resultCoin.name
                },crypto,memecoin,CNCrypto`,
              },
              {
                text: '🗳️ Vote',
                url: `https://CNCrypto.io/coin/${resultCoin?.slug}`,
              },
            ],
          ],
        },
      });
    } else {
      botTelegram.sendMessage(chatId, message, {
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: '🚀 CX/Shill',
                url: `https://twitter.com/intent/tweet?via=cncrypto_io&text=%F0%9F%91%91%20Vote%20for%20${
                  resultCoin?.name
                }%20%40${
                  resultCoin?.links?.find((item) =>
                    item?.name?.includes('TWITTER'),
                  ) &&
                  `${resultCoin?.links
                    ?.find((item) => item?.name?.includes('TWITTER'))
                    .link.replace('https://twitter.com/', '')}`
                }%20at%20https://cncrypto.io/coin/${
                  resultCoin?.slug
                }%20%2C%20the%20most%20powerful%20Chinese%20coin%20index%20platform%21%21%0A%0ALets%20take%20it%20to%20the%20moon%21%F0%9F%8C%95%20%0A%0A&hashtags=${
                  resultCoin.name
                },crypto,memecoin,CNCrypto`,
              },
              {
                text: '🗳️ Vote',
                url: `https://CNCrypto.io/coin/${resultCoin?.slug}`,
              },
            ],
          ],
        },
      });
    }

    return { data: coin };
  }

  async unApproveCoin(slug) {
    const coin = await this.coinModel.findOne({ slug });

    coin.status = STATUS.APPROVING;
    coin.approvedAt = null;
    await coin.save();

    return { data: coin };
  }

  private async getTokenInfo(address: string) {
    const http = this.httpService
      .get('https://api.dexscreener.com/latest/dex/tokens/' + address)
      .pipe(map((res) => res.data));
    const data = await lastValueFrom(http);
    if (!data?.pairs) {
      return null;
    }
    const tokenInfo = data?.pairs?.find(
      (item) =>
        item?.baseToken?.address?.toLowerCase() === address?.toLowerCase(),
    );
    if (!tokenInfo) {
      return null;
    }
    return tokenInfo;
  }

  private async getChatMembersCountTelegram(idOrUrl: string) {
    const http = this.httpService
      .get(
        `https://api.telegram.org/bot${BOT_TOKEN_TELEGRAM}/getChatMembersCount?chat_id=@` +
          idOrUrl.replace(/^.*\//g, ''),
      )
      .pipe(map((res) => res.data));
    const data = await lastValueFrom(http);
    return data.result || 0;
  }

  private async getFollowCountTwitter(idOrUrl: string) {
    const http = this.httpService
      .get(
        `https://api.twitter.com/2/users/by/username/` +
          idOrUrl.replace(/^.*\//g, '') +
          `?user.fields=public_metrics`,
        {
          headers: {
            Authorization: 'Bearer ' + API_TOKEN_TWITTER,
          },
        },
      )
      .pipe(map((res) => res.data));
    const data = await lastValueFrom(http);
    return data?.data?.public_metrics?.followers_count || 0;
  }
}
