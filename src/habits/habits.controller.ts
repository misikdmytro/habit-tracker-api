import { Controller, Get } from '@nestjs/common';

@Controller('habits')
export class HabitsController {
  @Get('/')
  getHabits() {
    return [];
  }
}
