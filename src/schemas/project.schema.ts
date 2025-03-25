import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Company } from './company.schema';
import * as mongoose from 'mongoose';

export enum ProjectStatus {
  ACTIVE = 'Active',
  ARCHIVED = 'Archived',
}

export enum ProjectPriority {
  HIGH = 1,
  MEDIUM = 2,
  LOW = 3,
}

export type ProjectDocument = HydratedDocument<Project>;

@Schema()
export class Project {
  _id: { type: mongoose.Schema.Types.Mixed, required: true };

  @Prop()
  name: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Company' })
  company: Company;

  @Prop()
  description?: string;

  @Prop()
  status: ProjectStatus;

  @Prop()
  priority?: ProjectPriority;

  @Prop()
  tags?: string[];
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
