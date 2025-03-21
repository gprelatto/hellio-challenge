import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserCompanyPermission } from 'src/entities/user-company.entity';
import { User } from 'src/entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserCompanyPermission.name) private userCompanyPermissionModel: Model<UserCompanyPermission>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async getUserPermissions(userId: string): Promise<UserCompanyPermission[]> {
    return this.userCompanyPermissionModel.find({ user: userId }).populate('company').exec();
  }
  
  async findById(userId: string): Promise<User | null> {
    return this.userModel.findById(userId).exec();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).populate('company').exec();
  } 
  
  async createUser(userData: Partial<User>): Promise<User> {
    const newUser = new this.userModel(userData);
    return newUser.save();
  }
}