import {
  Body,
  Controller,
  Get,
  HttpCode,
  Inject,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateHabitDto, GetHabitsDto } from './habit.type';
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
    const result = await this.habitsService.create(dto);
    return result;
  }

  @Get()
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Habit list has been successfully retrieved.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error.',
  })
  @ApiOperation({ summary: 'Get all habits' })
  async getAll(
    @Query()
    dto: GetHabitsDto = { page: 1, limit: 10 },
  ) {
    const result = await this.habitsService.getAll(dto);
    return result;
  }
}
