import { UserCompanyPermission } from './user-company.schema';
import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  _id: { type: mongoose.Schema.Types.Mixed, required: true };

  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  companyPermissions?: UserCompanyPermission[];
}

export const UserSchema = SchemaFactory.createForClass(User);
