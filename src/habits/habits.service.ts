import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateHabitDto } from './../types/habit.type';
import { Habit, HabitDocument } from './habit.schema';

@Injectable()
export class HabitsService {
  constructor(
    @InjectModel(Habit.name) private habitModel: Model<HabitDocument>,
  ) {}

  async create(dto: CreateHabitDto): Promise<string> {
    const createdHabit = new this.habitModel(dto);
    const result = await createdHabit.save();
    return result._id.toHexString();
  }
}
