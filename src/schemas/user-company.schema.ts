import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
import { Company } from './company.schema';
import { User } from './user.schema';

export enum ProjectPermission {
  READ = 'Read',
  WRITE = 'Write',
  DELETE = 'Delete',
  ADMIN = 'Admin',
}

export type UserDocument = HydratedDocument<UserCompanyPermission>;

@Schema()
export class UserCompanyPermission {
  _id: { type: mongoose.Schema.Types.Mixed; required: true };

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Company' })
  company: Company;

  @Prop()
  permissions: ProjectPermission[];
}

export const UserCompanyPermissionSchema = SchemaFactory.createForClass(UserCompanyPermission);
