import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { Habit } from './habit.schema';
import { HabitDto, HabitFrequency } from './habit.type';
import { HabitsController } from './habits.controller';
import { HabitsService } from './habits.service';

describe('HabitsController', () => {
  let service: HabitsService;
  let controller: HabitsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HabitsController],
      providers: [
        HabitsService,
        {
          provide: getModelToken(Habit.name),
          useValue: Model,
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
    jest
      .spyOn(service, 'create')
      .mockImplementation(async () => ({ id, ...habitDto }));

    const result = await controller.create(habitDto);
    expect(result.id).toBe(id);
    expect(result.name).toBe(habitDto.name);
    expect(result.category).toBe(habitDto.category);
    expect(result.frequency).toBe(habitDto.frequency);
  });

  it('should get all habits', async () => {
    const habits: HabitDto[] = [
      {
        id: 'id1',
        name: 'Test Habit 1',
        category: 'Test Category 1',
        frequency: HabitFrequency.DAILY,
      },
      {
        id: 'id2',
        name: 'Test Habit 2',
        category: 'Test Category 2',
        frequency: HabitFrequency.WEEKLY,
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
