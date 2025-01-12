import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import mongoose from 'mongoose';
import * as request from 'supertest';
import { v4 as uuidv4 } from 'uuid';
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
    it('should return 201', async () => {
      const habit = {
        name: uuidv4(),
        category: uuidv4(),
        frequency: 1,
      };

      const response = await request(app.getHttpServer())
        .post('/habits')
        .send(habit)
        .expect(201);

      const { id, name, category, frequency, createdAt, updatedAt } =
        response.body;

      expect(id).toBeDefined();
      expect(name).toBe(habit.name);
      expect(category).toBe(habit.category);
      expect(frequency).toBe('weekly');
      expect(createdAt).toBeDefined();
      expect(updatedAt).toBeDefined();
      expect(createdAt).toBe(updatedAt);
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

    invalidReuqests.forEach(({ name, requestBody, responseBody }) => {
      it(`should return 400 (${name})`, async () => {
        const response = await request(app.getHttpServer())
          .post('/habits')
          .send(requestBody)
          .expect(400);

        expect(response.body).toEqual(responseBody);
      });
    });
  });

  describe('/habits (GET)', () => {
    it('should return 200', async () => {
      const response = await request(app.getHttpServer())
        .get('/habits')
        .expect(200);

      const { habits, total } = response.body;

      expect(habits).toBeDefined();
      expect(total).toBeDefined();
    });

    it('should return 200 with query', async () => {
      const response = await request(app.getHttpServer())
        .get('/habits')
        .query({ category: 'Test Category', frequency: 1 })
        .expect(200);

      const { habits, total } = response.body;

      expect(habits).toBeDefined();
      expect(total).toBeDefined();
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
          message: ['page must not be less than 1'],
          error: 'Bad Request',
          statusCode: 400,
        },
      },
      {
        name: 'less than minimum limit',
        query: { limit: 0 },
        responseBody: {
          message: ['limit must not be less than 1'],
          error: 'Bad Request',
          statusCode: 400,
        },
      },
      {
        name: 'more than maximum limit',
        query: { limit: 101 },
        responseBody: {
          message: ['limit must not be greater than 100'],
          error: 'Bad Request',
          statusCode: 400,
        },
      },
    ];

    invalidReuqests.forEach(({ name, query, responseBody }) => {
      it(`should return 400 (${name})`, async () => {
        const response = await request(app.getHttpServer())
          .get('/habits')
          .query(query)
          .expect(400);

        expect(response.body).toEqual(responseBody);
      });
    });
  });

  describe('/habits/:id (GET)', () => {
    it('should return 404', async () => {
      const objectId = new mongoose.Types.ObjectId();
      const response = await request(app.getHttpServer())
        .get(`/habits/${objectId.toHexString()}`)
        .expect(404);

      const { message } = response.body;

      expect(message).toBe('Habit not found');
    });

    const invalidRequests = [
      {
        name: 'invalid id',
        id: 'invalid',
        responseBody: {
          message: ['id must match /^[0-9a-fA-F]{24}$/ regular expression'],
          error: 'Bad Request',
          statusCode: 400,
        },
      },
    ];

    invalidRequests.forEach(({ name, id, responseBody }) => {
      it(`should return 400 (${name})`, async () => {
        const response = await request(app.getHttpServer())
          .get(`/habits/${id}`)
          .expect(400);

        expect(response.body).toEqual(responseBody);
      });
    });
  });

  describe('combined', () => {
    it('should create a habit and get it', async () => {
      const habit = {
        name: uuidv4(),
        category: uuidv4(),
        frequency: 1,
      };

      const createResponse = await request(app.getHttpServer())
        .post('/habits')
        .send(habit)
        .expect(201);

      const { id, createdAt, updatedAt } = createResponse.body;

      const getResponse = await request(app.getHttpServer())
        .get(`/habits/${id}`)
        .expect(200);

      const { name, category, frequency } = getResponse.body;

      expect(name).toBe(habit.name);
      expect(category).toBe(habit.category);
      expect(frequency).toBe('weekly');

      const getAllResponse1 = await request(app.getHttpServer())
        .get('/habits')
        .query({ category: 'Test Category', frequency: 1 })
        .expect(200);

      const { habits: habits1 } = getAllResponse1.body;
      expect(habits1.length).toBeGreaterThanOrEqual(1);

      const getAllResponse2 = await request(app.getHttpServer())
        .get('/habits')
        .query({ page: 1, limit: 1 })
        .expect(200);

      const { habits: habits2 } = getAllResponse2.body;

      expect(habits2.length).toBe(1);
      const result = habits2[0];
      expect(result.name).toBe(habit.name);
      expect(result.category).toBe(habit.category);
      expect(result.frequency).toBe('weekly');
      expect(result.id).toBe(id);
      expect(result.createdAt).toBe(createdAt);
      expect(result.updatedAt).toBe(updatedAt);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
