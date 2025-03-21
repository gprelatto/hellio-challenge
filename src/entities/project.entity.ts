import { Column, Entity, ObjectId, ObjectIdColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Company } from './company.entity';

export enum ProjectStatus {
  ACTIVE = 'Active',
  ARCHIVED = 'Archived',
}

export enum ProjectPriority {
  HIGH = 1,
  MEDIUM = 2,
  LOW = 3,
}

@Entity()
export class Project {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  name: string;

  @Column((type) => Company)
  company: Company

  @Column()
  description?: string;

  @Column({ enum: ProjectStatus })
  status: ProjectStatus;

  @Column({ enum: ProjectPriority })
  priority?: ProjectPriority;

  @Column()
  tags?: string[];
}