import { Body, Controller, HttpCode, Inject, Post } from '@nestjs/common';
import { CreateHabitDto } from './../types/habit.type';
import { HabitsService } from './habits.service';
import { ApiBody, ApiResponse } from '@nestjs/swagger';

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
  async create(@Body() dto: CreateHabitDto) {
    const id = await this.habitsService.create(dto);

    return {
      id: id,
    };
  }
}
