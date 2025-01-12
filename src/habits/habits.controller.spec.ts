import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Habit } from './habit.schema';
import { HabitDto, HabitFrequency } from './habit.type';
import { HabitsController } from './habits.controller';
import { HabitsService } from './habits.service';

describe('HabitsController', () => {
  let service: HabitsService;
  let controller: HabitsController;

  beforeEach(async () => {
    const mockLogger = {
      debug: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      log: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [HabitsController],
      providers: [
        HabitsService,
        {
          provide: getModelToken(Habit.name),
          useValue: Model,
        },
        {
          provide: WINSTON_MODULE_PROVIDER,
          useValue: mockLogger,
        },
      ],
    }).compile();

    service = module.get<HabitsService>(HabitsService);
    controller = module.get<HabitsController>(HabitsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a new habit', async () => {
    const habitDto = {
      name: 'Test Habit',
      category: 'Test Category',
      frequency: HabitFrequency.DAILY,
    };

    const id = 'id';
    jest.spyOn(service, 'create').mockImplementation(async () => ({
      id,
      ...habitDto,
      frequency: 'daily',
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    const result = await controller.create(habitDto);
    expect(result.id).toBe(id);
    expect(result.name).toBe(habitDto.name);
    expect(result.category).toBe(habitDto.category);
    expect(result.frequency).toBe('daily');
    expect(result.createdAt).toBeDefined();
    expect(result.updatedAt).toBeDefined();
  });

  it('should get all habits', async () => {
    const habits: HabitDto[] = [
      {
        id: 'id1',
        name: 'Test Habit 1',
        category: 'Test Category 1',
        frequency: 'daily',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'id2',
        name: 'Test Habit 2',
        category: 'Test Category 2',
        frequency: 'weekly',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    jest.spyOn(service, 'getAll').mockImplementation(async () => ({
      habits,
      total: 42,
    }));

    const result = await controller.getAll();
    expect(result.habits).toHaveLength(2);
    expect(result.total).toBe(42);
  });
});
