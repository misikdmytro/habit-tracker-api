import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Habit } from './habit.schema';
import { HabitsController } from './habits.controller';
import { HabitsService } from './habits.service';

describe('HabitsController', () => {
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

    controller = module.get<HabitsController>(HabitsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
