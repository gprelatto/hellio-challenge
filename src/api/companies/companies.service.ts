import { forwardRef, HttpException, Inject, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { UsersService } from '../users/users.service';
import { InjectModel } from '@nestjs/mongoose';
import { Company } from '@/schemas/company.schema';
import { Model } from 'mongoose';
import { UserCompanyPermissonsService } from '../user-company-permissions/user-company-permissons.service';
import { ProjectPermission } from '@/schemas/user-company.schema';

@Injectable()
export class CompanyService {
  constructor(
    @InjectModel(Company.name) private companyModel: Model<Company>,
  ) {}

  @Inject(UsersService)
  private readonly userService: UsersService;

  @Inject(forwardRef(() => UserCompanyPermissonsService))
  private readonly userCompanyPermissionsService: UserCompanyPermissonsService;

  async getCompanies(): Promise<Company[]> {
    return this.companyModel.find().exec();
  }

  async findCompany(id: string): Promise<Company> {
    const company = await this.companyModel
      .findOne({ _id: new Types.ObjectId(id) })
      .exec();
    if (!company) throw new HttpException('Company not found', 404);
    return company;
  }

  async createCompany(
    email: string,
    companyData: Partial<Company>,
  ): Promise<Company> {
    const createdCompany = new this.companyModel(companyData);
    await createdCompany.save();

    const user = await this.userService.findByEmail(email);

    await this.userCompanyPermissionsService.addRole(
      user.email,
      createdCompany._id.toString(),
      [
        ProjectPermission.ADMIN,
        ProjectPermission.DELETE,
        ProjectPermission.READ,
        ProjectPermission.WRITE,
      ],
    );

    return createdCompany;
  }
}
