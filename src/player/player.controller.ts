import { CACHE_MANAGER, Controller, Get, Inject, Param } from '@nestjs/common';
import { PlayerService } from './player.service';

@Controller('player')
export class PlayerController {
  constructor(
    private readonly playerService: PlayerService,
    @Inject(CACHE_MANAGER) private cacheManager: any,
  ) {}

  @Get(':puuid')
  async getMyRank(@Param('puuid') puuid: string) {
    return this.playerService.getMyRank(puuid);
  }
}
