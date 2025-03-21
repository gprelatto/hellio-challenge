import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company } from 'src/entities/company.entity';

@Injectable()
export class CompanyService {
  constructor(
    @InjectModel(Company.name) private companyModel: Model<Company>,
  ) {}

  async createCompany(userData: Partial<Company>): Promise<Company> {
    const newCompany = new this.companyModel(userData);
    return newCompany.save();
  }
}