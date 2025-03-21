import { Company } from './company.entity';
import { Column, Entity, ObjectId, ObjectIdColumn } from 'typeorm';
import { User } from './user.entity';

export enum ProjectPermission {
  READ = 'Read',
  WRITE = 'Write',
  DELETE = 'Delete',
  ADMIN = 'Admin',
}

@Entity()
export class UserCompanyPermission {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column((type) => User)
  user: User

  @Column((type) => Company)
  company: Company

  @Column({ enum: ProjectPermission, default: ProjectPermission.READ })
  permissions: ProjectPermission[];
}