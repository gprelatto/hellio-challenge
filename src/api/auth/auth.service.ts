import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDTO } from './auth.dto';
import { UsersService } from '../users/users.service';
import { User } from '@/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const permissions = await this.usersService.getCompanyPermissons(user.email);
      user.companyPermissions = permissions;
      return user;
    }
    return null;
  }

  async login(user: User) {
    const payload = { email: user.email, companyPermissions: user.companyPermissions };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(user: CreateUserDTO) {
    const existentUser = await this.usersService.findByEmail(user.email);
    if (existentUser) throw new HttpException('User with this email already exists.', HttpStatus.CONFLICT);
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
    return this.usersService.createUser(user);
  }
}
