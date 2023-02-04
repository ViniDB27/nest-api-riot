import { Test, TestingModule } from '@nestjs/testing';
import { SummaryService } from './summary.service';
import { RiotService } from '../services/riot/riot.service';
import { MatchesService } from '../matches/matches.service';
import { PlayerService } from '../player/player.service';

describe('SummaryService', () => {
  let summaryService: SummaryService;
  let riotService: RiotService;
  let matchesService: MatchesService;
  let playerService: PlayerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SummaryService,
        {
          provide: RiotService,
          useValue: {
            getSummonerByName: jest.fn(),
            getLeaguesBySummonerId: jest.fn(),
          },
        },
        {
          provide: MatchesService,
          useValue: {
            findBySummonerName: jest.fn(),
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

    summaryService = module.get<SummaryService>(SummaryService);
    riotService = module.get<RiotService>(RiotService);
    matchesService = module.get<MatchesService>(MatchesService);
    playerService = module.get<PlayerService>(PlayerService);
  });

  describe('getSummary', () => {
    it('should return a overall summary if queue is not provided', async () => {
      const summonerName = 'test summoner';
      const regionCode = 'br1';
      const summoner = {
        id: '123',
        accountId: '123',
        puuid: '123',
        name: 'name',
        profileIconId: 1,
        revisionDate: 1,
        summonerLevel: 1,
      };
      const matches = [];
      const player = {
        id: 1,
        puuid: 'string',
        accountId: 'string',
        summonerId: 'string',
        name: 'string',
        summonerLevel: 1,
        pdl: 1,
        winRate: 1,
        region: 'string',
      };
      const leagues = [
        {
          queueType: 'RANKED_SOLO_5x5',
          leaguePoints: 100,
          wins: 10,
          losses: 20,
          leagueId: 'string',
          tier: 'string',
          rank: 'string',
          summonerId: 'string',
          summonerName: 'string',
          veteran: false,
          inactive: false,
          freshBlood: false,
          hotStreak: false,
        },
      ];

      jest.spyOn(riotService, 'getSummonerByName').mockResolvedValue(summoner);
      jest
        .spyOn(matchesService, 'findBySummonerName')
        .mockResolvedValue(matches);
      jest.spyOn(playerService, 'findOne').mockResolvedValue(player);
      jest
        .spyOn(riotService, 'getLeaguesBySummonerId')
        .mockResolvedValue(leagues);

      const result = await summaryService.getSummary(summonerName, regionCode);

      expect(result).toEqual([
        {
          csPerMinute: NaN,
          freshBlood: false,
          hotStreak: false,
          inactive: false,
          kda: NaN,
          leagueId: 'string',
          leaguePoints: 100,
          losses: 20,
          queueId: 420,
          queueType: 'RANKED_SOLO_5x5',
          rank: 'string',
          summonerId: 'string',
          summonerName: 'string',
          tier: 'string',
          veteran: false,
          vision: NaN,
          wins: 10,
        },
      ]);
    });
  });
});
