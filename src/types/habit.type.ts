import { IsNotEmpty, IsIn } from 'class-validator';

export enum HabitFrequency {
  DAILY = 0,
  WEEKLY = 1,
  MONTHLY = 2,
}

export class CreateHabitDto {
  @IsNotEmpty()
  name: string;

  category: string;

  @IsIn([HabitFrequency.DAILY, HabitFrequency.WEEKLY, HabitFrequency.MONTHLY])
  frequency: HabitFrequency;
}
