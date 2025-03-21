import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserCompanyPermission } from './user-company.entity';

@Schema({ collection: 'users', timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, unique: true })
  password: string;  

  companyPermissions?: UserCompanyPermission[];
}

export const UserSchema = SchemaFactory.createForClass(User);
