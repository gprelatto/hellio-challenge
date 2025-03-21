import { Column, Entity, ObjectId, ObjectIdColumn } from 'typeorm';
import { User } from './user.entity';
import { Project } from './project.entity';

export enum ProjectPermission {
  READ = 'Read',
  WRITE = 'Write',
  DELETE = 'Delete',
  ADMIN = 'Admin',
}

@Entity()
export class UserProjectPermission {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column((type) => User)
  user: User

  @Column((type) => Project)
  project: Project

  @Column({ enum: ProjectPermission, default: ProjectPermission.READ })
  permissions: ProjectPermission[];
}