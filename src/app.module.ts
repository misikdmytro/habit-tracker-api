import { Module } from '@nestjs/common';
import { HabitsModule } from './habits/habits.module';
import { StatsModule } from './stats/stats.module';

@Module({
  imports: [HabitsModule, StatsModule],
})
export class AppModule {}
