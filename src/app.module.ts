import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { HabitsModule } from './habits/habits.module';
import { HealthModule } from './health/health.module';
import { OpenTelemetryModule } from '@metinseylan/nestjs-opentelemetry';
import { ZipkinExporter } from '@opentelemetry/exporter-zipkin';
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env', `.env.${process.env.NODE_ENV}`],
    }),
    WinstonModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        level: configService.get('LOG_LEVEL'),
        transports: [
          new winston.transports.Console({
            format: winston.format.combine(
              winston.format.timestamp(),
              winston.format.ms(),
            ),
          }),
          new winston.transports.File({
            filename: 'logs/app.log',
            format: winston.format.combine(
              winston.format.timestamp(),
              winston.format.ms(),
            ),
            maxsize: 5242880, // 5MB
          }),
        ],
      }),
      inject: [ConfigService],
    }),
    OpenTelemetryModule.forRootAsync({
      imports: [ConfigModule],
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      useFactory: async (configService: ConfigService) => ({
        serviceName: 'habit-tracker-api',
        spanProcessor: new SimpleSpanProcessor(
          new ZipkinExporter({
            url: configService.get('ZIPKIN_URI'),
          }),
        ),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),
    HabitsModule,
    HealthModule,
  ],
})
export class AppModule {}
