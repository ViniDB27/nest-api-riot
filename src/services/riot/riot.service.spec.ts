import { HttpException } from '@nestjs/common';
import axios from 'axios';
import { RiotService } from './riot.service';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('RiotService', () => {
  let riotService: RiotService;

  beforeEach(() => {
    riotService = new RiotService();
  });

  describe('getSummonerByName', () => {
    it('should return a summoner object', async () => {
      const summoner = {
        name: 'summonerName',
        summonerLevel: 100,
        accountId: '12345',
      };

      mockedAxios.get.mockResolvedValue({ data: summoner });

      const result = await riotService.getSummonerByName('summonerName', 'na1');
      expect(result).toEqual(summoner);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/summonername',
        { headers: { 'X-Riot-Token': undefined } },
      );
    });

    it('should throw an error if the API returns an error', async () => {
      const errorMessage = 'Http Exception';
      const status = 404;
      mockedAxios.get.mockRejectedValue({
        response: { data: errorMessage },
        status,
      });

      await expect(
        riotService.getSummonerByName('summonerName', 'na1'),
      ).rejects.toThrowError(new HttpException(errorMessage, status));
    });
  });

  describe('getMatchesByPuuid', () => {
    it('should return a list of match ids', async () => {
      const matchIds = ['12345', '67890'];
      mockedAxios.get.mockResolvedValue({ data: matchIds });

      const result = await riotService.getMatchesByPuuid('puuid', 'americas', {
        count: 20,
        start: 0,
      });
      expect(result).toEqual(matchIds);
    });

    it('should return a list of match ids with a queue filter', async () => {
      const matchIds = ['12345', '67890'];
      mockedAxios.get.mockResolvedValue({ data: matchIds });

      const result = await riotService.getMatchesByPuuid('puuid', 'americas', {
        count: 20,
        start: 0,
        queue: 400,
      });
      expect(result).toEqual(matchIds);
    });

    it('should throw an error if the API returns an error', async () => {
      const errorMessage = 'Http Exception';
      const status = 404;
      mockedAxios.get.mockRejectedValue({
        response: { data: errorMessage },
        status,
      });

      await expect(
        riotService.getMatchesByPuuid('puuid', 'americas', {
          count: 20,
          start: 0,
        }),
      ).rejects.toThrowError(new HttpException(errorMessage, status));
    });
  });
});
