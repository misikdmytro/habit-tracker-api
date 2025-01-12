import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { HabitsModule } from './habits/habits.module';
import { StatsModule } from './stats/stats.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    WinstonModule.forRoot({
      level: process.env.LOG_LEVEL || 'debug',
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
          ),
        }),
      ],
    }),
    ConfigModule.forRoot({
      envFilePath: ['.env', `.env.${process.env.NODE_ENV}`],
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    HabitsModule,
    StatsModule,
    HealthModule,
  ],
})
export class AppModule {}
