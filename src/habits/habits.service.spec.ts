import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Habit } from './habit.schema';
import { HabitFrequency } from './habit.type';
import { HabitsService } from './habits.service';

describe('HabitsService', () => {
  let service: HabitsService;
  const mockHabitModel: any = jest.fn();

  beforeEach(async () => {
    const mockLogger = {
      debug: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      log: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HabitsService,
        {
          provide: getModelToken(Habit.name),
          useValue: mockHabitModel,
        },
        {
          provide: WINSTON_MODULE_PROVIDER,
          useValue: mockLogger,
        },
      ],
    }).compile();

    service = module.get<HabitsService>(HabitsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new habit', async () => {
    const habitDto = {
      name: 'Test Habit',
      category: 'Test Category',
      frequency: HabitFrequency.DAILY,
    };

    const id = 'id';
    const save = {
      _id: {
        toHexString() {
          return id;
        },
      },
      ...habitDto,
    };

    mockHabitModel.mockReturnValue({ save: jest.fn().mockResolvedValue(save) });
    const result = await service.create(habitDto);

    expect(result.id).toBe(id);
    expect(result.name).toBe(habitDto.name);
    expect(result.category).toBe(habitDto.category);
    expect(result.frequency).toBe('daily');
  });

  it('should get all habits', async () => {
    const habits = [
      {
        _id: {
          toHexString() {
            return 'id1';
          },
        },
        name: 'Test Habit 1',
        category: 'Test Category 1',
        frequency: HabitFrequency.DAILY,
      },
      {
        _id: {
          toHexString() {
            return 'id2';
          },
        },
        name: 'Test Habit 2',
        category: 'Test Category 2',
        frequency: HabitFrequency.WEEKLY,
      },
    ];

    const habitModel: any = {};
    mockHabitModel.find = jest.fn().mockReturnValue(habitModel);
    habitModel.skip = jest.fn().mockReturnValue(habitModel);
    habitModel.limit = jest.fn().mockReturnValue(habitModel);
    habitModel.sort = jest.fn().mockReturnValue(habitModel);
    habitModel.exec = jest.fn().mockReturnValue(habits);

    const countDocumentsModel: any = {};
    mockHabitModel.countDocuments = jest
      .fn()
      .mockReturnValue(countDocumentsModel);
    countDocumentsModel.exec = jest.fn().mockResolvedValue(habits.length);

    const result = await service.getAll();

    expect(result.habits).toHaveLength(2);
    expect(result.total).toBe(2);
  });
});
