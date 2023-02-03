import { CacheModule, Module } from '@nestjs/common';
import { SummaryService } from './summary.service';
import { SummaryController } from './summary.controller';
import { RiotService } from 'src/services/riot/riot.service';
import { MatchesService } from 'src/matches/matches.service';
import { PlayerModule } from 'src/player/player.module';
import { DatabaseModule } from 'src/database/database.module';
import { PlayerService } from 'src/player/player.service';
import { playerProviders } from 'src/player/player.providers';

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
