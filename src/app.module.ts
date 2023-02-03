import { Module, CacheModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MatchesModule } from './matches/matches.module';
import { ConfigModule } from '@nestjs/config';
import { SummaryModule } from './summary/summary.module';
import { databaseProviders } from './database/database.providers';
import { PlayerModule } from './player/player.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    MatchesModule,
    ConfigModule.forRoot(),
    SummaryModule,
    PlayerModule,
    DatabaseModule,
    CacheModule.register(),
  ],
  controllers: [AppController],
  providers: [AppService, ...databaseProviders],
  exports: [...databaseProviders],
})
export class AppModule {}
