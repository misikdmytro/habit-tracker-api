import { Test, TestingModule } from '@nestjs/testing';
import { HabitsService } from './habits.service';
import { getModelToken } from '@nestjs/mongoose';
import { Habit } from './../schemas/habit.schema';
import { HabitFrequency } from './../types/habit.type';

describe('HabitsService', () => {
  let service: HabitsService;
  const mockHabitModel: jest.Mock = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HabitsService,
        {
          provide: getModelToken(Habit.name),
          useValue: mockHabitModel,
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

    mockHabitModel.mockImplementation(() => ({
      save: jest.fn().mockReturnValue(save),
    }));

    const result = await service.create(habitDto);

    expect(result).toBe(id);
  });
});
