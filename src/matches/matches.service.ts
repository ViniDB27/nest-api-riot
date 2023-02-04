import { Injectable } from '@nestjs/common';
import { getRegionName } from '../helpers/get-region-name';
import { PlayerService } from '../player/player.service';
import { RiotService } from '../services/riot/riot.service';
import {
  Match,
  MatchesByPuuidOptions,
  RegionCode,
} from '../services/riot/riot.types';

@Injectable()
export class MatchesService {
  constructor(
    private riotService: RiotService,
    private playerService: PlayerService,
  ) {}

  async findBySummonerName(
    summonerName: string,
    regionCode: RegionCode,
    option: MatchesByPuuidOptions,
  ) {
    const arrayOfMatches: Match[] = [];

    const summoner = await this.riotService.getSummonerByName(
      summonerName,
      regionCode,
    );

    const matches = await this.riotService.getMatchesByPuuid(
      summoner.puuid,
      getRegionName(regionCode),
      option,
    );

    const leagues = await this.riotService.getLeaguesBySummonerId(
      summoner.id,
      regionCode,
    );

    const league = leagues.find(
      (league) => league.queueType === 'RANKED_SOLO_5x5',
    );

    const player = await this.playerService.findOne(summoner.puuid);

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

    for (const matchId of matches) {
      const match = await this.riotService.getMatchById(
        matchId,
        getRegionName(regionCode),
      );
      arrayOfMatches.push(match);
    }

    return arrayOfMatches;
  }
}
