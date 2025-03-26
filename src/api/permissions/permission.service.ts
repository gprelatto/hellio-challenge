import { Injectable } from '@nestjs/common';
import { User } from '@/schemas/user.schema';

@Injectable()
export class PermissionService {
  hasPermissions(user: User, companyId: string, requiredRoles: string[]): boolean {
    if (!user.companyPermissions) return false;

    for (const permission of user.companyPermissions) {
      if (String(permission.company._id) === companyId && permission.permissions.some(role => requiredRoles.includes(role))) {
        return true;
      }
    }
    return false;
  }
}
