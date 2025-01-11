import { Body, Controller, HttpCode, Inject, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateHabitDto } from './../types/habit.type';
import { HabitsService } from './habits.service';

@Controller('habits')
export class HabitsController {
  constructor(@Inject(HabitsService) private habitsService: HabitsService) {}

  @Post()
  @HttpCode(201)
  @ApiBody({ type: CreateHabitDto })
  @ApiResponse({
    status: 201,
    description: 'The habit has been successfully created.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error.',
  })
  @ApiOperation({ summary: 'Create a new habit' })
  async create(@Body() dto: CreateHabitDto) {
    const id = await this.habitsService.create(dto);

    return {
      id: id,
    };
  }
}
