import { CacheModule, CACHE_MANAGER } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseModule } from '../database/database.module';
import { PlayerController } from './player.controller';
import { playerProviders } from './player.providers';
import { PlayerService } from './player.service';

describe('PlayerController', () => {
  let playerController: PlayerController;
  let playerService: PlayerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, CacheModule.register()],
      controllers: [PlayerController],
      providers: [
        ...playerProviders,
        PlayerService,
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
      ],
    }).compile();

    playerController = module.get<PlayerController>(PlayerController);
    playerService = module.get<PlayerService>(PlayerService);
  });

  it('should be defined', () => {
    expect(playerController).toBeDefined();
  });

  it('should return player rank', async () => {
    const puuid = 'puuid';
    const rank = { leaguePoints: { top: 1 }, winRate: { top: 1 } };
    jest.spyOn(playerService, 'getMyRank').mockResolvedValue(rank);

    const result = await playerController.getMyRank(puuid);

    expect(result).toEqual(rank);
    expect(playerService.getMyRank).toHaveBeenCalledWith(puuid);
  });
});
