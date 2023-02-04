import { CacheModule, CACHE_MANAGER } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseModule } from '../database/database.module';
import { MatchesService } from '../matches/matches.service';
import { PlayerModule } from '../player/player.module';
import { playerProviders } from '../player/player.providers';
import { PlayerService } from '../player/player.service';
import { RiotService } from '../services/riot/riot.service';
import { RegionCode } from '../services/riot/riot.types';
import { SummaryController } from './summary.controller';
import { SummaryService } from './summary.service';

describe('SummaryController', () => {
  let controller: SummaryController;
  let summaryService: SummaryService;
  let cacheManager: any;

  beforeEach(async () => {
    cacheManager = {
      get: jest.fn().mockResolvedValue(null),
      set: jest.fn().mockResolvedValue(null),
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, PlayerModule, CacheModule.register()],
      controllers: [SummaryController],
      providers: [
        ...playerProviders,
        SummaryService,
        RiotService,
        MatchesService,
        PlayerService,
        {
          provide: CACHE_MANAGER,
          useValue: cacheManager,
        },
      ],
    }).compile();

    controller = module.get<SummaryController>(SummaryController);
    summaryService = module.get<SummaryService>(SummaryService);
  });

  describe('findOne', () => {
    const summonerName = 'summonerName';
    const regionCode: RegionCode = 'br1';
    const queue = 420;
    const cache = { key: 'value' };
    const response = { response: 'value' };

    it('should return cache if it is valid', async () => {
      cacheManager.get = jest.fn().mockResolvedValue(JSON.stringify(cache));

      const result = await controller.findOne(summonerName, regionCode, queue);

      expect(cacheManager.get).toHaveBeenCalledWith(
        `${summonerName}-${regionCode}-${queue}`,
      );
      expect(result).toEqual(cache);
    });

    it('should return response from summaryService if cache is not valid', async () => {
      cacheManager.get = jest.fn().mockResolvedValue(null);
      summaryService.getSummary = jest.fn().mockResolvedValue(response);

      const result = await controller.findOne(summonerName, regionCode, queue);

      expect(cacheManager.get).toHaveBeenCalledWith(
        `${summonerName}-${regionCode}-${queue}`,
      );
      expect(summaryService.getSummary).toHaveBeenCalledWith(
        summonerName,
        regionCode,
        queue,
      );
      expect(cacheManager.set).toHaveBeenCalledWith(
        `${summonerName}-${regionCode}-${queue}`,
        JSON.stringify(response),
        60000,
      );
      expect(result).toEqual(response);
    });

    it('should return response from summaryService if cache is not found', async () => {
      cacheManager.get = jest.fn().mockResolvedValue(null);
      summaryService.getSummary = jest.fn().mockResolvedValue(response);

      const result = await controller.findOne(summonerName, regionCode, queue);

      expect(cacheManager.get).toHaveBeenCalledWith(
        `${summonerName}-${regionCode}-${queue}`,
      );
      expect(summaryService.getSummary).toHaveBeenCalledWith(
        summonerName,
        regionCode,
        queue,
      );
      expect(cacheManager.set).toHaveBeenCalledWith(
        `${summonerName}-${regionCode}-${queue}`,
        JSON.stringify(response),
        60000,
      );
      expect(result).toEqual(response);
    });
  });
});
