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
  UpdateHabitByIdDto,
} from './habit.type';

@Injectable()
export class HabitsService {
  constructor(
    @InjectModel(Habit.name) private habitModel: Model<HabitDocument>,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async create(dto: CreateHabitDto): Promise<HabitDto> {
    this.logger.log({
      level: 'debug',
      message: 'Creating a new habit',
    });

    const now = new Date();
    const createdHabit = new this.habitModel({
      ...dto,
      createdAt: now,
      updatedAt: now,
    });
    const result = await createdHabit.save();

    this.logger.log({
      level: 'info',
      message: 'Created a new habit',
      id: result._id.toHexString(),
    });

    return this.mapToDto(result);
  }

  async getAll(
    params: GetHabitsDto = { page: 1, limit: 10 },
  ): Promise<GetHabitResponse> {
    this.logger.log({
      level: 'debug',
      message: 'Getting all habits',
      data: params,
    });

    const { page, limit, ...query } = params;
    const result = await this.habitModel
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 })
      .exec();

    const total = await this.habitModel.countDocuments(query).exec();
    const habits = result.map(this.mapToDto);

    this.logger.log({
      level: 'info',
      message: 'Got all habits',
      data: { total },
    });

    return { habits, total: total };
  }

  async get(id: string): Promise<HabitDto> {
    this.logger.log({
      level: 'debug',
      message: 'Getting a habit',
      id,
    });

    const habit = await this.habitModel.findById(id).exec();
    if (!habit) {
      this.logger.log({
        level: 'info',
        message: 'Habit not found',
        data: id,
      });

      return null;
    }

    this.logger.log({
      level: 'info',
      message: 'Got a habit',
      id,
    });

    return this.mapToDto(habit);
  }

  async update(id: string, dto: UpdateHabitByIdDto): Promise<HabitDto> {
    this.logger.log({
      level: 'debug',
      message: 'Updating a habit',
      id,
    });

    const habit = await this.habitModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();

    if (!habit) {
      this.logger.log({
        level: 'info',
        message: 'Habit not found',
        id,
      });

      return null;
    }

    this.logger.log({
      level: 'info',
      message: 'Updated a habit',
      id,
    });

    return this.mapToDto(habit);
  }

  async delete(id: string): Promise<boolean> {
    this.logger.log({
      level: 'debug',
      message: 'Deleting a habit',
      id,
    });

    const result = await this.habitModel.findByIdAndDelete(id).exec();
    if (!result) {
      this.logger.log({
        level: 'info',
        message: 'Habit not found',
        id,
      });

      return false;
    }

    this.logger.log({
      level: 'info',
      message: 'Deleted a habit',
      id,
    });

    return true;
  }

  private mapToDto(habit: HabitDocument): HabitDto {
    const frequencies = {
      0: 'daily',
      1: 'weekly',
      2: 'monthly',
    };

    return {
      id: habit._id.toHexString(),
      name: habit.name,
      category: habit.category,
      frequency: frequencies[habit.frequency],
      createdAt: habit.createdAt,
      updatedAt: habit.updatedAt,
    };
  }
}
