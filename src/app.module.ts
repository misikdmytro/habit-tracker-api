import { Module } from '@nestjs/common';
import { HabitsModule } from './habits/habits.module';
import { StatsModule } from './stats/stats.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env', `.env.${process.env.NODE_ENV}`],
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    HabitsModule,
    StatsModule,
  ],
})
export class AppModule {}
