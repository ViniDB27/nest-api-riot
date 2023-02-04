import { CacheModule, Module } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { MatchesController } from './matches.controller';
import { RiotService } from '../services/riot/riot.service';
import { DatabaseModule } from '../database/database.module';
import { PlayerModule } from '../player/player.module';
import { PlayerService } from '../player/player.service';
import { playerProviders } from '../player/player.providers';

@Module({
  imports: [DatabaseModule, PlayerModule, CacheModule.register()],
  controllers: [MatchesController],
  providers: [...playerProviders, MatchesService, RiotService, PlayerService],
})
export class MatchesModule {}
