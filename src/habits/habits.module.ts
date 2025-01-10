import { Module } from '@nestjs/common';
import { HabitsService } from './habits.service';
import { HabitsController } from './habits.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Habit, HabitSchema } from './../schemas/habit.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Habit.name, schema: HabitSchema }]),
  ],
  providers: [HabitsService],
  controllers: [HabitsController],
})
export class HabitsModule {}
