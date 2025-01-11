import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: ['.env', `.env.${process.env.NODE_ENV}`],
        }),
        AppModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());

    await app.init();
  });

  describe('/habits (POST', () => {
    it('should return 201', () => {
      return request(app.getHttpServer())
        .post('/habits')
        .send({
          name: 'Test Habit',
          category: 'Test Category',
          frequency: 0,
        })
        .expect(201);
    });

    const invalidReuqests = [
      {
        name: 'no name',
        requestBody: {
          category: 'Test Category',
          frequency: 0,
        },
      },
      {
        name: 'wrong frequency',
        requestBody: {
          name: 'Test Habit',
          category: 'Test Category',
          frequency: 3,
        },
      },
    ];

    invalidReuqests.forEach(({ name, requestBody }) => {
      it(`should return 400 (${name})`, () => {
        return request(app.getHttpServer())
          .post('/habits')
          .send(requestBody)
          .expect(400);
      });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
