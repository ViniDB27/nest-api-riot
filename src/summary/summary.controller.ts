import {
  CACHE_MANAGER,
  Controller,
  Get,
  Inject,
  Param,
  Query,
} from '@nestjs/common';
import { RegionCode } from '../services/riot/riot.types';
import { SummaryService } from './summary.service';
import { cacheIsValid } from '../helpers/cache-is-valid';

@Controller('summary')
export class SummaryController {
  constructor(
    private readonly summaryService: SummaryService,
    @Inject(CACHE_MANAGER) private cacheManager: any,
  ) {}

  @Get(':summonerName')
  async findOne(
    @Param('summonerName') summonerName: string,
    @Query('regionCode') regionCode: RegionCode,
    @Query('queue') queue?: number,
  ) {
    const cache = (await this.cacheManager.get(
      `${summonerName}-${regionCode}-${queue}`,
    )) as string;

    if (cache && cacheIsValid(cache)) {
      return JSON.parse(cache);
    } else {
      const response = await this.summaryService.getSummary(
        summonerName,
        regionCode,
        queue,
      );

      await this.cacheManager.set(
        `${summonerName}-${regionCode}-${queue}`,
        JSON.stringify(response),
        60000,
      );

      return response;
    }
  }
}
