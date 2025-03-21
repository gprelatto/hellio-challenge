import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

@Schema({ collection: 'companies', timestamps: true })
export class Company extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  industry?: string;
}

export const CompanySchema = SchemaFactory.createForClass(Company);