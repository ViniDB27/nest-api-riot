import { CacheModule, Module } from '@nestjs/common';
import { PlayerService } from './player.service';
import { PlayerController } from './player.controller';
import { playerProviders } from './player.providers';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule, CacheModule.register()],
  controllers: [PlayerController],
  providers: [...playerProviders, PlayerService],
})
export class PlayerModule {}
