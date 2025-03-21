import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company } from 'src/entities/company.entity';
import { ProjectPermission, UserCompanyPermission } from 'src/entities/user-company.entity';

@Injectable()
export class CompanyService {
  constructor(
    @InjectModel(Company.name) private companyModel: Model<Company>,
    @InjectModel(UserCompanyPermission.name) private userCompanyModel: Model<UserCompanyPermission>,
  ) {}

  async createCompany(userId: string, userData: Partial<Company>): Promise<Company> {
    const newCompany = new this.companyModel(userData);
    newCompany.save();

    // adding full access since the user is the owner
    const assignedOwner = new this.userCompanyModel({
      userId: userId, 
      companyId: newCompany._id,
      permissions: [ProjectPermission.ADMIN, ProjectPermission.DELETE, ProjectPermission.READ, ProjectPermission.WRITE],
    });
    await assignedOwner.save();
    
    return newCompany;
  }
}