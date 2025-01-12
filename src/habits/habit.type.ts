import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  Matches,
  Max,
  Min,
} from 'class-validator';

export enum HabitFrequency {
  DAILY = 0,
  WEEKLY = 1,
  MONTHLY = 2,
}

export const AllHabitFrequencies = [
  HabitFrequency.DAILY,
  HabitFrequency.WEEKLY,
  HabitFrequency.MONTHLY,
];

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
  @IsOptional()
  category: string;

  @ApiProperty({
    example: HabitFrequency.DAILY,
    description: 'The frequency of the habit',
    required: true,
    enum: HabitFrequency,
  })
  @Type(() => Number)
  @IsIn(AllHabitFrequencies)
  frequency: HabitFrequency;
}

export class GetHabitsDto {
  @ApiProperty({
    example: 'health',
    description: 'The category of the habit',
    required: false,
  })
  @IsOptional()
  category?: string;

  @ApiProperty({
    example: HabitFrequency.DAILY,
    description: 'The frequency of the habit',
    required: false,
    enum: HabitFrequency,
  })
  @Type(() => Number)
  @IsOptional()
  @IsIn(AllHabitFrequencies)
  frequency?: HabitFrequency;

  @ApiProperty({
    example: 1,
    description: 'The page number (1-based index)',
    required: false,
    default: 1,
  })
  @Type(() => Number)
  @IsOptional()
  @Min(1)
  page?: number;

  @ApiProperty({
    example: 10,
    description: 'The number of items per page',
    required: false,
    default: 10,
    minimum: 1,
    maximum: 100,
  })
  @Type(() => Number)
  @IsOptional()
  @Min(1)
  @Max(100)
  limit?: number;
}

export class GetHabitByIdDto {
  @ApiProperty({
    example: 'id',
    description: 'The ID of the habit',
    required: true,
  })
  @IsNotEmpty()
  @Matches(/^[0-9a-fA-F]{24}$/)
  id: string;
}

export class HabitDto {
  id: string;
  name: string;
  category: string;
  frequency: string;
  createdAt: Date;
  updatedAt: Date;
}

export class GetHabitResponse {
  habits: HabitDto[];
  total: number;
}
