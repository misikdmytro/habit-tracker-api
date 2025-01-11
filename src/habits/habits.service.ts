import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Habit, HabitDocument } from './habit.schema';
import {
  CreateHabitDto,
  GetHabitResponse,
  GetHabitsDto,
  HabitDto,
} from './habit.type';

@Injectable()
export class HabitsService {
  constructor(
    @InjectModel(Habit.name) private habitModel: Model<HabitDocument>,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async create(dto: CreateHabitDto): Promise<HabitDto> {
    this.logger.debug({
      message: 'Creating a new habit',
      data: dto,
    });

    const createdHabit = new this.habitModel(dto);
    const result = await createdHabit.save();

    this.logger.debug({
      message: 'Created a new habit',
      data: result,
    });

    return this.mapToDto(result);
  }

  async getAll(
    params: GetHabitsDto = { page: 1, limit: 10 },
  ): Promise<GetHabitResponse> {
    this.logger.debug({
      message: 'Getting all habits',
      data: params,
    });

    const { page, limit, ...query } = params;
    const result = await this.habitModel
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    const total = await this.habitModel.countDocuments(query).exec();
    const habits = result.map(this.mapToDto);

    this.logger.debug({
      message: 'Got all habits',
      data: { habits, total },
    });

    return { habits, total: total };
  }

  private mapToDto(habit: HabitDocument): HabitDto {
    return {
      id: habit._id.toHexString(),
      name: habit.name,
      category: habit.category,
      frequency: habit.frequency,
    };
  }
}
