import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsIn } from 'class-validator';

export enum HabitFrequency {
  DAILY = 0,
  WEEKLY = 1,
  MONTHLY = 2,
}

export class CreateHabitDto {
  @ApiProperty({
    example: 'Drink water',
    description: 'The name of the habit',
    required: true,
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'health',
    description: 'The category of the habit',
    required: true,
  })
  category: string;

  @ApiProperty({
    example: HabitFrequency.DAILY,
    description: 'The frequency of the habit',
    required: true,
    enum: HabitFrequency,
  })
  @IsIn([HabitFrequency.DAILY, HabitFrequency.WEEKLY, HabitFrequency.MONTHLY])
  frequency: HabitFrequency;
}
