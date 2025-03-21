import { UserCompanyPermission } from './user-company.entity';
import { Column, Entity, ObjectId, ObjectIdColumn } from 'typeorm';
import { UserProjectPermission } from './user-project.entity';

@Entity()
export class User {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column({ nullable: false })
  name: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false })
  password: string;  

  companyPermissions?: UserCompanyPermission[];
  projectPermissions?: UserProjectPermission[];
}