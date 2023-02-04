import { Test, TestingModule } from '@nestjs/testing';
import { MatchesService } from './matches.service';
import { RiotService } from '../services/riot/riot.service';
import { PlayerService } from '../player/player.service';

describe('MatchesService', () => {
  let service: MatchesService;
  let riotService: RiotService;
  let playerService: PlayerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MatchesService,
        {
          provide: RiotService,
          useValue: {
            getSummonerByName: jest.fn(),
            getMatchesByPuuid: jest.fn(),
            getLeaguesBySummonerId: jest.fn(),
            getMatchById: jest.fn(),
          },
        },
        {
          provide: PlayerService,
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MatchesService>(MatchesService);
    riotService = module.get<RiotService>(RiotService);
    playerService = module.get<PlayerService>(PlayerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return array of matches', async () => {
    const summonerName = 'summoner';
    const regionCode = 'br1';
    const option = {
      queue: 420,
      count: 10,
      start: 0,
    };

    const summoner = {
      puuid: 'puuid',
      accountId: 'accountId',
      id: 'summonerId',
      name: 'summonerName',
      summonerLevel: 30,
    };
    (riotService.getSummonerByName as jest.Mock).mockResolvedValue(summoner);

    const matches = ['match1', 'match2'];
    (riotService.getMatchesByPuuid as jest.Mock).mockResolvedValue(matches);

    const leagues = [
      {
        queueType: 'RANKED_SOLO_5x5',
        leaguePoints: 100,
        wins: 50,
        losses: 50,
      },
    ];
    (riotService.getLeaguesBySummonerId as jest.Mock).mockResolvedValue(
      leagues,
    );

    const match = {
      gameId: 'gameId',
    };
    (riotService.getMatchById as jest.Mock).mockResolvedValue(match);

    const player = {
      id: 'playerId',
    };
    (playerService.findOne as jest.Mock).mockResolvedValue(player);

    let result = await service.findBySummonerName(
      summonerName,
      regionCode,
      option,
    );

    const expectedResult = [
      {
        gameId: 'gameId',
      },
      {
        gameId: 'gameId',
      },
    ];

    result = await service.findBySummonerName(summonerName, regionCode, option);

    expect(result).toEqual(expectedResult);
  });
});
