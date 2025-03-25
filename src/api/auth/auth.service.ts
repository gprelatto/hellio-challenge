import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDTO } from './auth.dto';
import { UsersService } from '../users/users.service';
import { User } from '@/schemas/user.schema';
import { UserCompanyPermissonsService } from '../user-company-permissions/user-company-permissons.service';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  @Inject(UsersService)
  private readonly userService: UsersService;

  @Inject(UserCompanyPermissonsService)
  private readonly userCompanyPermissionsService: UserCompanyPermissonsService;

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const permissions = await this.userCompanyPermissionsService.getUserCompanyRoles(user._id.toString());
      user.companyPermissions = permissions;
      return user;
    }
    return null;
  }

  async login(user: User) {
    const payload = { id: user._id, companyPermissions: user.companyPermissions };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(user: CreateUserDTO) {
    await this.userService.checkEmailExist(user.email);
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
    return this.userService.createUser(user);
  }
}
