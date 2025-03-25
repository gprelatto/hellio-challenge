import { User } from '../../schemas/user.schema';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async checkEmailExist(email: string): Promise<User | null> {
    const user = await this.userModel.findOne({ email }).exec();
    if (user)
      throw new HttpException(
        'User with this email already exists.',
        HttpStatus.CONFLICT,
      );
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) throw new HttpException('User not found: ' + email, HttpStatus.NOT_FOUND);
    return user;
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.userModel
      .findOne({ _id: new Types.ObjectId(id) })
      .exec();
    if (!user) throw new HttpException('User not found: ' +id, HttpStatus.NOT_FOUND);
    return user;
  }

  async createUser(userData: Partial<User>): Promise<User> {
    const createdUser = new this.userModel(userData);
    return createdUser.save();
  }
}
