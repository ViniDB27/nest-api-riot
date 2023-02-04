import {
  CACHE_MANAGER,
  Controller,
  Get,
  Inject,
  Param,
  Query,
} from '@nestjs/common';
import { MatchesService } from './matches.service';
import { RegionCode } from '../services/riot/riot.types';
import { cacheIsValid } from '../helpers/cache-is-valid';

@Controller('matches')
export class MatchesController {
  constructor(
    private readonly matchesService: MatchesService,
    @Inject(CACHE_MANAGER) public cacheManager: any,
  ) {}

  @Get(':summonerName')
  async findOne(
    @Param('summonerName') summonerName: string,
    @Query('regionCode') regionCode: RegionCode,
    @Query('count') count?: number,
    @Query('start') start?: number,
    @Query('queue') queue?: number,
  ) {
    const cache = (await this.cacheManager.get(
      `${summonerName}-${regionCode}-${count}-${start}-${queue}`,
    )) as string;

    if (cache && cacheIsValid(cache)) {
      return JSON.parse(cache);
    } else {
      const response = await this.matchesService.findBySummonerName(
        summonerName,
        regionCode,
        {
          count,
          start,
          queue,
        },
      );

      await this.cacheManager.set(
        `${summonerName}-${regionCode}-${count}-${start}-${queue}`,
        JSON.stringify(response),
        60000,
      );

      return response;
    }
  }
}
