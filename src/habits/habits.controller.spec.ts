import { Test, TestingModule } from '@nestjs/testing';
import { HabitsController } from './habits.controller';
import { HabitsService } from './habits.service';
import { getModelToken } from '@nestjs/mongoose';
import { Habit } from './../schemas/habit.schema';
import { Model } from 'mongoose';
import { HabitFrequency } from './../types/habit.type';

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
    jest.spyOn(service, 'create').mockImplementation(async () => id);

    const result = await controller.create(habitDto);
    expect(result.id).toBe(id);
  });
});
