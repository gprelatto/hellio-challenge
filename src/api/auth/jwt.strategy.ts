import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWT_SECRET } from 'config';
import { UsersService } from '../users/users.service';
import { UserCompanyPermissonsService } from '../user-company-permissions/user-company-permissons.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService, private userCompanyPermissionsService: UserCompanyPermissonsService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_SECRET || 'your_jwt_secret',
    });
  }

  async validate(payload: any) {
    const user = await this.usersService.findById(payload.id);
    if (!user) return null;
    
    const companyPermissions = await this.userCompanyPermissionsService.getUserCompanyRoles(payload.id);
  
    return {
      email: user.email,
      companyPermissions
    };
  }
}