import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { User } from '@/schemas/user.schema';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>(
      ROLES_KEY,
      context.getHandler(),
    );
    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest();
    const user: User = request.user;
    if(!user.companyPermissions) return false;
    for (const permisson of user.companyPermissions) {
      if (
        request.params.companyId &&
        permisson.company._id == request.params.companyId
      ) {
        for (const role of permisson.permissions) {
          if (requiredRoles.includes(role)) return true;
        }
      }
    }
    return false;
  }
}
