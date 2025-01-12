import {
  Body,
  Controller,
  Get,
  HttpCode,
  Inject,
  Param,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { CreateHabitDto, GetHabitByIdDto, GetHabitsDto } from './habit.type';
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
    schema: {
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        category: { type: 'string' },
        frequency: { type: 'string' },
      },
    },
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
  @ApiResponse({
    status: 200,
    description: 'Habit list has been successfully retrieved.',
    schema: {
      properties: {
        habits: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              category: { type: 'string' },
              frequency: { type: 'string' },
            },
          },
        },
        total: { type: 'number' },
      },
    },
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

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Habit has been successfully retrieved.',
    schema: {
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        category: { type: 'string' },
        frequency: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request.',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error.',
  })
  @ApiOperation({ summary: 'Get a habit' })
  async get(@Param() dto: GetHabitByIdDto, @Res() res: Response) {
    const result = await this.habitsService.get(dto.id);
    if (!result) {
      res.status(404).json({ message: 'Habit not found' }).send();
      return;
    }

    res.status(200).json(result).send();
  }
}
