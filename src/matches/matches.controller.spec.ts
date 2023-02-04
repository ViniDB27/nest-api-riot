import { Test, TestingModule } from '@nestjs/testing';
import { MatchesController } from './matches.controller';
import { MatchesService } from './matches.service';
import { CACHE_MANAGER } from '@nestjs/common';
import { RiotService } from '../services/riot/riot.service';
import { PlayerService } from '../player/player.service';
import { playerProviders } from '../player/player.providers';
import { DatabaseModule } from '../database/database.module';

describe('MatchesController', () => {
  let controller: MatchesController;
  let service: MatchesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
      controllers: [MatchesController],
      providers: [
        MatchesService,
        RiotService,
        PlayerService,
        ...playerProviders,
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<MatchesController>(MatchesController);
    service = module.get<MatchesService>(MatchesService);
  });

  describe('findOne', () => {
    it('should return cached data if cache is valid', async () => {
      const summonerName = 'summoner-name';
      const regionCode = 'br1';
      const count = 5;
      const start = 0;
      const queue = 400;
      const cache = '{"data": "cached"}';
      (controller.cacheManager.get as jest.Mock).mockResolvedValue(cache);

      const cacheIsValid = jest.fn();
      cacheIsValid.mockReturnValue(false);

      const result = await controller.findOne(
        summonerName,
        regionCode,
        count,
        start,
        queue,
      );

      expect(result).toEqual({ data: 'cached' });
      expect(controller.cacheManager.get).toHaveBeenCalledWith(
        `${summonerName}-${regionCode}-${count}-${start}-${queue}`,
      );
    });

    it('should return fresh data if cache is invalid', async () => {
      const summonerName = 'summoner-name';
      const regionCode = 'br1';
      const count = 5;
      const start = 0;
      const queue = 400;
      (controller.cacheManager.get as jest.Mock).mockResolvedValue(undefined);

      const cacheIsValid = jest.fn();
      cacheIsValid.mockReturnValue(false);
      const response = [];
      jest.spyOn(service, 'findBySummonerName').mockResolvedValue(response);

      const result = await controller.findOne(
        summonerName,
        regionCode,
        count,
        start,
        queue,
      );

      expect(result).toEqual(response);
      expect(controller.cacheManager.get).toHaveBeenCalled;
    });
  });
});
