import { CacheModule, Module } from '@nestjs/common';
import { SummaryService } from './summary.service';
import { SummaryController } from './summary.controller';
import { RiotService } from '../services/riot/riot.service';
import { MatchesService } from '../matches/matches.service';
import { PlayerModule } from '../player/player.module';
import { DatabaseModule } from '../database/database.module';
import { PlayerService } from '../player/player.service';
import { playerProviders } from '../player/player.providers';

@Module({
  imports: [DatabaseModule, PlayerModule, CacheModule.register()],
  controllers: [SummaryController],
  providers: [
    ...playerProviders,
    SummaryService,
    RiotService,
    MatchesService,
    PlayerService,
  ],
})
export class SummaryModule {}
