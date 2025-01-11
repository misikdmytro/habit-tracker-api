import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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
  ) {}

  async create(dto: CreateHabitDto): Promise<HabitDto> {
    const createdHabit = new this.habitModel(dto);
    const result = await createdHabit.save();
    return this.mapToDto(result);
  }

  async getAll(
    params: GetHabitsDto = { page: 1, limit: 10 },
  ): Promise<GetHabitResponse> {
    const { page, limit, ...query } = params;
    const result = await this.habitModel
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    const total = await this.habitModel.countDocuments(query).exec();
    const habits = result.map(this.mapToDto);

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
