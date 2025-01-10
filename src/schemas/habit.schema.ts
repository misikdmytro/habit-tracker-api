import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { HabitFrequency } from './../types/habit.type';

export type HabitDocument = HydratedDocument<Habit>;

@Schema()
export class Habit {
  @Prop({ required: true })
  name: string;

  @Prop()
  category: string;

  @Prop({ required: true })
  frequency: HabitFrequency;
}

export const HabitSchema = SchemaFactory.createForClass(Habit);
