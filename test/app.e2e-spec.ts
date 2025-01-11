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
          frequency: 1,
        })
        .expect(201)
        .then((response) => {
          const { id, name, category, frequency } = response.body;
          expect(id).toBeDefined();
          expect(name).toBe('Test Habit');
          expect(category).toBe('Test Category');
          expect(frequency).toBe(1);
        });
    });

    const invalidReuqests = [
      {
        name: 'no name',
        requestBody: {
          category: 'Test Category',
          frequency: 0,
        },
        responseBody: {
          message: ['name should not be empty'],
          error: 'Bad Request',
          statusCode: 400,
        },
      },
      {
        name: 'wrong frequency',
        requestBody: {
          name: 'Test Habit',
          category: 'Test Category',
          frequency: 3,
        },
        responseBody: {
          message: ['frequency must be one of the following values: 0, 1, 2'],
          error: 'Bad Request',
          statusCode: 400,
        },
      },
    ];

    invalidReuqests.forEach(({ name, requestBody }) => {
      it(`should return 400 (${name})`, () => {
        return request(app.getHttpServer())
          .post('/habits')
          .send(requestBody)
          .expect(400)
          .then((response) => {
            const { message, error, statusCode } = response.body;
            expect(message).toBeDefined();
            expect(error).toBe('Bad Request');
            expect(statusCode).toBe(400);
          });
      });
    });
  });

  describe('/habits (GET)', () => {
    it('should return 200', () => {
      return request(app.getHttpServer())
        .get('/habits')
        .expect(200)
        .then((response) => {
          const { habits, total } = response.body;
          expect(habits).toBeDefined();
          expect(total).toBeDefined();
        });
    });

    it('should return 200 with query', () => {
      return request(app.getHttpServer())
        .get('/habits')
        .query({ category: 'Test Category', frequency: 1 })
        .expect(200)
        .then((response) => {
          const { habits, total } = response.body;
          expect(habits).toBeDefined();
          expect(total).toBeDefined();
        });
    });

    const invalidReuqests = [
      {
        name: 'wrong frequency',
        query: { category: 'Test Category', frequency: 3 },
        responseBody: {
          message: ['frequency must be one of the following values: 0, 1, 2'],
          error: 'Bad Request',
          statusCode: 400,
        },
      },
      {
        name: 'wrong page number',
        query: { page: 0 },
        responseBody: {
          message: ['page must be greater than or equal to 1'],
          error: 'Bad Request',
          statusCode: 400,
        },
      },
      {
        name: 'less than minimum limit',
        query: { limit: 0 },
        responseBody: {
          message: ['limit must be greater than or equal to 1'],
          error: 'Bad Request',
          statusCode: 400,
        },
      },
      {
        name: 'more than maximum limit',
        query: { limit: 101 },
        responseBody: {
          message: ['limit must be less than or equal to 100'],
          error: 'Bad Request',
          statusCode: 400,
        },
      },
    ];

    invalidReuqests.forEach(({ name, query }) => {
      it(`should return 400 (${name})`, () => {
        return request(app.getHttpServer())
          .get('/habits')
          .query(query)
          .expect(400)
          .then((response) => {
            const { message, error, statusCode } = response.body;
            expect(message).toBeDefined();
            expect(error).toBe('Bad Request');
            expect(statusCode).toBe(400);
          });
      });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
