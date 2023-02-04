import { Test, TestingModule } from '@nestjs/testing';
import { PlayerService } from './player.service';

class RepositoryMock {
  find() {
    return [{ id: 1, puuid: 'puuid1', region: 'region1' }];
  }
  findOneBy() {
    return { id: 1, puuid: 'puuid1', region: 'region1' };
  }
  findOne() {
    return { id: 1, puuid: 'puuid1', region: 'region1' };
  }
  findOneByRegion() {
    return [{ id: 1, puuid: 'puuid1', region: 'region1' }];
  }
  save() {
    return { id: 1, puuid: 'puuid1', region: 'region1' };
  }
}

describe('PlayerService', () => {
  let playerService: PlayerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayerService,
        {
          provide: 'PLAYER_REPOSITORY',
          useClass: RepositoryMock,
        },
      ],
    }).compile();

    playerService = module.get<PlayerService>(PlayerService);
  });

  describe('create', () => {
    it('should return the created player', async () => {
      const createPlayerDto = {
        puuid: 'puuid1',
        accountId: 'accountId1',
        summonerId: 'summonerId1',
        name: 'name1',
        summonerLevel: 100,
        pdl: 50,
        winRate: 0.5,
        region: 'region1',
      };

      const result = await playerService.create(createPlayerDto);
      expect(result).toEqual({ id: 1, puuid: 'puuid1', region: 'region1' });
    });
  });

  describe('findAll', () => {
    it('should return an array of players', async () => {
      const result = await playerService.findAll();
      expect(result).toEqual([{ id: 1, puuid: 'puuid1', region: 'region1' }]);
    });
  });

  describe('findAllByRegion', () => {
    it('should return an array of players by region', async () => {
      const result = await playerService.findAllByRegion('region1');
      expect(result).toEqual([{ id: 1, puuid: 'puuid1', region: 'region1' }]);
    });
  });

  describe('findOne', () => {
    it('should return a player by puuid', async () => {
      const result = await playerService.findOne('puuid1');
      expect(result).toEqual({ id: 1, puuid: 'puuid1', region: 'region1' });
    });
  });
});
