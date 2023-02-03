import { HttpException, Injectable } from '@nestjs/common';
import axios, { AxiosError } from 'axios';
import {
  League,
  Match,
  MatchesByPuuidOptions,
  RegionCode,
  RegionName,
  Summoner,
} from './riot.types';

@Injectable()
export class RiotService {
  private readonly apiKey = process.env.RIOT_API_KEY;

  private readonly requestHeaders = {
    'X-Riot-Token': this.apiKey,
  };

  async getSummonerByName(name: string, region: RegionCode): Promise<Summoner> {
    const summonerName = name.toLocaleLowerCase().replace(/ /g, '');

    const url = `https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}`;

    try {
      const response = await axios.get<Summoner>(url, {
        headers: this.requestHeaders,
      });

      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      console.log({ ...axiosError });
      throw new HttpException(axiosError.message, axiosError.status);
    }
  }

  async getMatchesByPuuid(
    puuid: string,
    region: RegionName,
    { count = 20, start = 0, queue = null }: MatchesByPuuidOptions,
  ) {
    const params = `start=${start}&count=${count}${
      queue ? `&queue=${queue}` : ''
    }`;
    const url = `https://${region}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?${params}`;
    try {
      const response = await axios.get<string[]>(url, {
        headers: this.requestHeaders,
      });

      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      console.log({ ...axiosError });
      throw new HttpException(axiosError.message, axiosError.status);
    }
  }

  async getMatchById(matchId: string, region: RegionName): Promise<Match> {
    const url = `https://${region}.api.riotgames.com/lol/match/v5/matches/${matchId}`;
    try {
      const response = await axios.get<Match>(url, {
        headers: this.requestHeaders,
      });

      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      console.log({ ...axiosError });
      throw new HttpException(axiosError.message, axiosError.status);
    }
  }

  async getLeaguesBySummonerId(summonerId: string, region: RegionCode) {
    const url = `https://${region}.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerId}`;
    try {
      const response = await axios.get<League[]>(url, {
        headers: this.requestHeaders,
      });

      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      console.log({ ...axiosError });
      throw new HttpException(axiosError.message, axiosError.status);
    }
  }
}
