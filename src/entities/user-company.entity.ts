import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from './user.entity';
import { Company } from './company.entity';

export enum ProjectPermission {
  READ = 'Read',
  WRITE = 'Write',
  DELETE = 'Delete',
  ADMIN = 'Admin',
}

@Schema({ collection: 'user_company_permissions', timestamps: true })
export class UserCompanyPermission extends Document {
  @Prop({ type: String, ref: 'User', required: true })
  user: User;

  @Prop({ type: String, ref: 'Company', required: true })
  company: Company;

  @Prop({ type: [String], enum: ProjectPermission, required: true })
  permissions: ProjectPermission[];
}

export const UserCompanyPermissionSchema = SchemaFactory.createForClass(UserCompanyPermission);