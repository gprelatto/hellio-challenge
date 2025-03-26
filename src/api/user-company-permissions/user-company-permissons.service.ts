import { ProjectPermission, UserCompanyPermission } from '../../schemas/user-company.schema';
import { HttpException, Inject, Injectable } from '@nestjs/common';
import { CompanyService } from '../companies/companies.service';
import { UsersService } from '../users/users.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UserCompanyPermissonsService {
  constructor(
    @InjectModel(UserCompanyPermission.name)
    private userCompanyPermissionModel: Model<UserCompanyPermission>
  ) {}

  @Inject(CompanyService)
  private readonly companyService: CompanyService;

  @Inject(UsersService)
  private readonly userService: UsersService;

  async getUserCompanyRoles(userId: string): Promise<UserCompanyPermission[]> {
    return this.userCompanyPermissionModel.find({ user: userId }).populate('company').populate('user').exec();
  }

  async addRole(email: string, companyId: string, permissions: ProjectPermission[]): Promise<UserCompanyPermission> {
    const company = await this.companyService.findCompany(companyId);
    const user = await this.userService.findByEmail(email);

    let existingPermission = await this.userCompanyPermissionModel.findOne({ user: user._id, company: company._id }).exec();

    if (existingPermission) {
      const updatedPermissions = Array.from(new Set([...existingPermission.permissions, ...permissions]));
      existingPermission.permissions = updatedPermissions;
    } else {
      existingPermission = new this.userCompanyPermissionModel({
        user,
        company,
        permissions,
      });
    }

    return existingPermission.save();
  }

  async removeRole(email: string, companyId: string, permissions: ProjectPermission[]): Promise<UserCompanyPermission> {
    const company = await this.companyService.findCompany(companyId);
    const user = await this.userService.findByEmail(email);

    let existingPermission = await this.userCompanyPermissionModel.findOne({ user: user._id, company: company._id }).exec();

    if (!existingPermission) throw new HttpException('Permissions not found', 404);

    const updatedPermissions = existingPermission.permissions.filter(permission => !permissions.includes(permission));

    existingPermission.permissions = updatedPermissions;

    return existingPermission.save();
  }
}
