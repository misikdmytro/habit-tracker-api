import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { v4 as uuidv4 } from 'uuid';
import { Habit, HabitLog } from './habit.schema';
import { HabitFrequency } from './habit.type';
import { HabitsService } from './habits.service';

describe('HabitsService', () => {
  let service: HabitsService;

  const mockHabitModel: any = jest.fn();
  const mockHabitLogModel: any = jest.fn();

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
          provide: getModelToken(HabitLog.name),
          useValue: mockHabitLogModel,
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
      name: uuidv4(),
      category: uuidv4(),
      frequency: HabitFrequency.DAILY,
    };

    const id = uuidv4();
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
            return uuidv4();
          },
        },
        name: uuidv4(),
        category: uuidv4(),
        frequency: HabitFrequency.DAILY,
      },
      {
        _id: {
          toHexString() {
            return uuidv4();
          },
        },
        name: uuidv4(),
        category: uuidv4(),
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

  it('should get a habit', async () => {
    const habit = {
      _id: {
        toHexString() {
          return uuidv4();
        },
      },
      name: uuidv4(),
      category: uuidv4(),
      frequency: HabitFrequency.DAILY,
    };

    mockHabitModel.findById = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(habit),
    });

    const result = await service.get('id');

    expect(result.id).toBeDefined();
    expect(result.name).toBe(habit.name);
    expect(result.category).toBe(habit.category);
    expect(result.frequency).toBe('daily');
  });

  it('should return null when habit not found', async () => {
    mockHabitModel.findById = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
    });

    const result = await service.get('id');

    expect(result).toBeNull();
  });

  it('should update a habit', async () => {
    const habitDto = {
      name: uuidv4(),
      category: uuidv4(),
      frequency: HabitFrequency.DAILY,
    };

    const habit = {
      _id: {
        toHexString() {
          return uuidv4();
        },
      },
      ...habitDto,
    };

    mockHabitModel.findByIdAndUpdate = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(habit),
    });

    const result = await service.update('id', habitDto);

    expect(result.id).toBeDefined();
    expect(result.name).toBe(habitDto.name);
    expect(result.category).toBe(habitDto.category);
    expect(result.frequency).toBe('daily');
  });

  it('should return null when habit not found', async () => {
    mockHabitModel.findByIdAndUpdate = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
    });

    const result = await service.update('id', {
      name: uuidv4(),
      category: uuidv4(),
      frequency: HabitFrequency.DAILY,
    });

    expect(result).toBeNull();
  });

  it('should delete a habit', async () => {
    mockHabitModel.findByIdAndDelete = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue({}),
    });

    mockHabitLogModel.deleteMany = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue({}),
    });

    const result = await service.delete('id');

    expect(result).toBe(true);
  });

  it('should return false when habit not found', async () => {
    mockHabitModel.findByIdAndDelete = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
    });

    const result = await service.delete('id');

    expect(result).toBe(false);
  });

  it('should track a habit', async () => {
    const habit = {
      _id: {
        toHexString() {
          return uuidv4();
        },
      },
      name: uuidv4(),
      category: uuidv4(),
      frequency: HabitFrequency.DAILY,
    };

    mockHabitModel.findById = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(habit),
    });

    const habitLog = {
      _id: {
        toHexString() {
          return uuidv4();
        },
      },
      habitId: habit._id.toHexString(),
      date: '2021-01-01',
      save: jest.fn(),
    };

    mockHabitLogModel.mockReturnValue({
      save: jest.fn().mockResolvedValue(habitLog),
    });

    const result = await service.track('id', { date: '2021-01-01' });

    expect(result.id).toBeDefined();
    expect(result.habitId).toBe(habitLog.habitId);
    expect(result.date).toBe(habitLog.date);
  });

  it('should return null when habit not found', async () => {
    mockHabitModel.findById = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
    });

    const result = await service.track('id', { date: '2021-01-01' });

    expect(result).toBeNull();
  });

  it('should delete track', async () => {
    mockHabitLogModel.findOneAndDelete = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue({}),
    });

    const result = await service.deleteTrack('id', { date: '2021-01-01' });

    expect(result).toBe(true);
  });

  it('should return false when habit tracking not found', async () => {
    mockHabitLogModel.findOneAndDelete = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
    });

    const result = await service.deleteTrack('id', { date: '2021-01-01' });

    expect(result).toBe(false);
  });
});
