import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';

export type CompanyDocument = HydratedDocument<Company>;

@Schema()
export class Company {
  _id: { type: mongoose.Schema.Types.Mixed, required: true };

  @Prop()
  name: string;

  @Prop()
  industry?: string;
}

export const CompanySchema = SchemaFactory.createForClass(Company);
