import { Injectable } from '@nestjs/common';
import { getQueueId } from '../helpers/get-queue-id';
import { MatchesService } from '../matches/matches.service';
import { PlayerService } from '../player/player.service';
import { RiotService } from '../services/riot/riot.service';
import { RegionCode, Summoner } from '../services/riot/riot.types';

@Injectable()
export class SummaryService {
  constructor(
    private riotService: RiotService,
    private matchesService: MatchesService,
    private playerService: PlayerService,
  ) {}

  async getSummary(
    summonerName: string,
    regionCode: RegionCode,
    queue?: number,
  ) {
    const summoner = await this.riotService.getSummonerByName(
      summonerName,
      regionCode,
    );

    if (!queue) {
      return this.getLeaguesSummary(summonerName, summoner, regionCode);
    } else {
      return this.getQueueSummary(summonerName, summoner, regionCode, queue);
    }
  }

  async getQueueSummary(
    summonerName: string,
    summoner: Summoner,
    regionCode: RegionCode,
    queue: number,
  ) {
    const matches = await this.matchesService.findBySummonerName(
      summonerName,
      regionCode,
      {
        count: 20,
        start: 0,
        queue,
      },
    );

    let kda = 0;
    let cs = 0;
    let vision = 0;
    let win = 0;
    let lose = 0;

    for (const match of matches) {
      const participant = match.info.participants.find(
        (p) => p.summonerId === summoner.id,
      );
      kda += participant.challenges.kda;
      cs += participant.totalMinionsKilled / (match.info.gameDuration / 60);
      vision += participant.visionScore;

      if (participant.win) {
        win++;
      } else {
        lose++;
      }
    }

    const player = await this.playerService.findOne(summoner.puuid);

    const leagues = await this.riotService.getLeaguesBySummonerId(
      summoner.id,
      regionCode,
    );

    const league = leagues.find(
      (league) => league.queueType === 'RANKED_SOLO_5x5',
    );

    const data = {
      puuid: summoner.puuid,
      accountId: summoner.accountId,
      summonerId: summoner.id,
      name: summoner.name,
      summonerLevel: summoner.summonerLevel,
      pdl: league.leaguePoints,
      winRate: Number.parseInt(
        ((league.wins * 100) / (league.wins + league.losses)).toString(),
      ),
      region: regionCode,
    };

    if (player) {
      await this.playerService.update(player.id, data);
    } else {
      await this.playerService.create(data);
    }

    return {
      gameMode: matches[0]?.info?.gameMode ?? 'Unknown',
      kda: kda / matches.length,
      cs: cs / matches.length,
      vision: vision / matches.length,
      win,
      lose,
    };
  }

  async getLeaguesSummary(
    summonerName: string,
    summoner: Summoner,
    regionCode: RegionCode,
  ) {
    const summaries: any[] = [];

    const leagues = await this.riotService.getLeaguesBySummonerId(
      summoner.id,
      regionCode,
    );

    for (const league of leagues) {
      const matches = await this.matchesService.findBySummonerName(
        summonerName,
        regionCode,
        {
          count: 20,
          start: 0,
          queue: getQueueId(league.queueType),
        },
      );

      let kda = 0;
      let cs = 0;
      let vision = 0;

      for (const match of matches) {
        const participant = match.info.participants.find(
          (p) => p.summonerId === summoner.id,
        );
        kda += participant.challenges.kda;
        cs += participant.totalMinionsKilled / (match.info.gameDuration / 60);
        vision += participant.visionScore;
      }

      const summary = {
        ...league,
        queueId: getQueueId(league.queueType),
        kda: Number((kda / matches.length).toFixed(2)),
        csPerMinute: Number((cs / matches.length).toFixed(2)),
        vision: Number((vision / matches.length).toFixed(2)),
      };

      summaries.push(summary);
    }

    return summaries;
  }
}
