import { CacheModule, Module } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { MatchesController } from './matches.controller';
import { RiotService } from 'src/services/riot/riot.service';
import { DatabaseModule } from 'src/database/database.module';
import { PlayerModule } from 'src/player/player.module';
import { PlayerService } from 'src/player/player.service';
import { playerProviders } from 'src/player/player.providers';

@Module({
  imports: [DatabaseModule, PlayerModule, CacheModule.register()],
  controllers: [MatchesController],
  providers: [...playerProviders, MatchesService, RiotService, PlayerService],
})
export class MatchesModule {}
