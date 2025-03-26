import { HttpException, Inject, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { CompanyService } from '../companies/companies.service';
import { InjectModel } from '@nestjs/mongoose';
import { Project } from '@/schemas/project.schema';
import { Model } from 'mongoose';

@Injectable()
export class ProjectService {
  constructor(@InjectModel(Project.name) private projectModel: Model<Project>) {}

  @Inject(CompanyService)
  private readonly companyService: CompanyService;

  async createProject(companyId: string, project: Partial<Project>): Promise<Project> {
    const company = await this.companyService.findCompany(companyId);

    const projectData = new this.projectModel({
      ...project,
      company,
    });

    return projectData.save();
  }

  async updateProject(companyId: string, projectId: string, projectData: Partial<Project>): Promise<Project> {
    await this.companyService.findCompany(companyId);
    let project = await this.projectModel.findOne({ _id: new Types.ObjectId(projectId) }).exec();
    if (!project) throw new HttpException('Project not found', 404);

    project.set(projectData);

    return project.save();
  }

  async findProjects(companyId: string): Promise<Project[]> {
    await this.companyService.findCompany(companyId);
    return this.projectModel.find({ company: new Types.ObjectId(companyId) }).exec();
  }
}
