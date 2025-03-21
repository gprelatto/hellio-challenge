import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum ProjectStatus {
  ACTIVE = 'Active',
  ARCHIVED = 'Archived',
}

export enum ProjectPriority {
  HIGH = 1,
  MEDIUM = 2,
  LOW = 3,
}

@Schema({ collection: 'projects', timestamps: true })
export class Project extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ required: true, enum: ProjectStatus })
  status: ProjectStatus;

  @Prop({ enum: ProjectPriority })
  priority?: ProjectPriority;

  @Prop([String])
  tags?: string[];
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
