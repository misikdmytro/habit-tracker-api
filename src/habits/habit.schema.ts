import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { HabitFrequency } from './habit.type';

export type HabitDocument = HydratedDocument<Habit>;

@Schema()
export class Habit {
  @Prop({ required: true })
  name: string;

  @Prop({ index: true })
  category: string;

  @Prop({ required: true, index: true })
  frequency: HabitFrequency;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const HabitSchema = SchemaFactory.createForClass(Habit);
