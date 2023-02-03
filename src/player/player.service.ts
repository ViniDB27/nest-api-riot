import { Inject, Injectable } from '@nestjs/common';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { Repository } from 'typeorm';
import { Player } from './entities/player.entity';

@Injectable()
export class PlayerService {
  constructor(
    @Inject('PLAYER_REPOSITORY')
    private playerRepository: Repository<Player>,
  ) {}

  create(createPlayerDto: CreatePlayerDto) {
    const player = new Player();
    player.puuid = createPlayerDto.puuid;
    player.accountId = createPlayerDto.accountId;
    player.summonerId = createPlayerDto.summonerId;
    player.name = createPlayerDto.name;
    player.summonerLevel = createPlayerDto.summonerLevel;
    player.pdl = createPlayerDto.pdl;
    player.winRate = createPlayerDto.winRate;
    player.region = createPlayerDto.region;

    return this.playerRepository.save(player);
  }

  async findAll() {
    return this.playerRepository.find();
  }

  async findAllByRegion(region: string) {
    return this.playerRepository.find({ where: { region } });
  }

  async findOne(puuid: string) {
    const player = this.playerRepository.findOneBy({ puuid });
    return player;
  }

  async update(id: number, updatePlayerDto: UpdatePlayerDto) {
    const player = await this.playerRepository.findOneBy({ id });

    player.puuid = updatePlayerDto.puuid;
    player.accountId = updatePlayerDto.accountId;
    player.summonerId = updatePlayerDto.summonerId;
    player.name = updatePlayerDto.name;
    player.summonerLevel = updatePlayerDto.summonerLevel;
    player.pdl = updatePlayerDto.pdl;
    player.winRate = updatePlayerDto.winRate;
    player.region = updatePlayerDto.region;

    return this.playerRepository.save(player);
  }

  async getMyRank(puuid: string) {
    const player = await this.findOne(puuid);

    const players = await this.findAllByRegion(player.region);

    const sortedPlayersByPdl = players
      .sort((a, b) => {
        return a.pdl - b.pdl;
      })
      .reverse();

    const sortedPlayersByWinRate = players
      .sort((a, b) => {
        return a.winRate - b.winRate;
      })
      .reverse();

    // console.log(sortedPlayersByPdl);
    // console.log(sortedPlayersByWinRate);

    return {
      leaguePoints: {
        top: sortedPlayersByPdl.findIndex((p) => p.id === player.id) + 1,
      },
      winRate: {
        top: sortedPlayersByWinRate.findIndex((p) => p.id === player.id) + 1,
      },
    };
  }
}
