import { HttpException, Injectable } from '@nestjs/common';
import { Company } from '../../entities/company.entity';
import { ProjectPermission, UserCompanyPermission } from '../../entities/user-company.entity';
import { DataSource } from 'typeorm';
import { ObjectId } from 'mongodb';
import { User } from '../../entities/user.entity';
import { Project } from '../../entities/project.entity';
import { UserProjectPermission } from '../../entities/user-project.entity';

@Injectable()
export class CompanyService {
  constructor(private readonly dataSource: DataSource) {}

  private companyRepository = this.dataSource.getMongoRepository(Company);
  private userRepository = this.dataSource.getMongoRepository(User);
  private userCompanyPermissonRepository = this.dataSource.getMongoRepository(UserCompanyPermission);
  private userProjectPremissonRepository = this.dataSource.getMongoRepository(UserProjectPermission);
  private projectRepository = this.dataSource.getMongoRepository(Project);
  

  async getCompanies(): Promise<Company[]> {
    return this.companyRepository.find();
  }

  async createCompany(email: string, companyData: Partial<Company>): Promise<Company> {
    const newCompany = await this.companyRepository.save(companyData);
    const user = await this.userRepository.findOne({where: {email: email}});
    
    // since its the owner, it has all permissions
    await this.userCompanyPermissonRepository.save({
      user: user,
      company: newCompany,
      permissions: [ProjectPermission.ADMIN, ProjectPermission.DELETE, ProjectPermission.READ, ProjectPermission.WRITE]
    });
    
    return newCompany;
  }

  async addRoleCompany(email: string, companyId: string, permissions: ProjectPermission[]): Promise<UserCompanyPermission> {
    const company = await this.companyRepository.findOne({ where: { _id: new ObjectId(companyId) } });
    if (!company) throw new HttpException('Company not found', 404);

    const user = await this.userRepository.findOne({ where: { email: email } });
    if (!user) throw new HttpException('User not found', 404);

    let existingPermission = await this.userCompanyPermissonRepository.findOne({
      where: { "user.email": user.email, "company.name": company.name }
    });

    if (existingPermission) {
      const updatedPermissions = Array.from(new Set([...existingPermission.permissions, ...permissions]));
      existingPermission.permissions = updatedPermissions;
    } else {
      existingPermission = this.userCompanyPermissonRepository.create({
        user,
        company,
        permissions
      });
    }

    return this.userCompanyPermissonRepository.save(existingPermission);
  }

  async removeRoleCompany(email: string, companyId: string, permissions: ProjectPermission[]): Promise<UserCompanyPermission> {
    const company = await this.companyRepository.findOne({ where: { _id: new ObjectId(companyId) } });
    if (!company) throw new HttpException('Company not found', 404);

    const user = await this.userRepository.findOne({ where: { email: email } });
    if (!user) throw new HttpException('User not found', 404);

    const existingPermission = await this.userCompanyPermissonRepository.findOne({
      where: { "user.email": user.email, "company.name": company.name }
    });

    if (!existingPermission) throw new HttpException('Permissions not found', 404);

    const updatedPermissions = existingPermission.permissions.filter(
      (permission) => !permissions.includes(permission)
    );

    existingPermission.permissions = updatedPermissions;

    return this.userCompanyPermissonRepository.save(existingPermission);
  }

  async handleRoleProject(email: string, companyId: string, projectId: string, permissions: ProjectPermission[]): Promise<UserProjectPermission> {
    const company = await this.companyRepository.findOne({ where: { _id: new ObjectId(companyId) } });
    if (!company) throw new HttpException('Company not found', 404);

    const user = await this.userRepository.findOne({ where: { email: email } });
    if (!user) throw new HttpException('User not found', 404);

    const project = await this.projectRepository.findOne({ where: { _id: new ObjectId(projectId) } });
    if (!project) throw new HttpException('User not found', 404);

    const existingPermission = await this.userProjectPremissonRepository.findOne({
      where: { "user.email": user.email, "project._id": new ObjectId(projectId) }
    });

    return this.userProjectPremissonRepository.save({
      ...existingPermission,
      user,
      project,
      permissions
    });
  }


  async createCompanyProject(companyId: string, project: Partial<Project>): Promise<Project> {
    const company = await this.companyRepository.findOne({ where: { _id: new ObjectId(companyId) } });
    if (!company) throw new HttpException('Company not found', 404);
    
    const projectData = this.projectRepository.create({
      ...project,
      company
    })
    
    return this.projectRepository.save(projectData);
  }

  async updateCompanyProject(companyId: string, projectId: string, projectData: Partial<Project>): Promise<Project> {
    const company = await this.companyRepository.findOne({ where: { _id: new ObjectId(companyId) } });
    if (!company) throw new HttpException('Company not found', 404);
   
    let project = await this.projectRepository.findOne({ where: { _id: new ObjectId(projectId) } });
    if (!project) throw new HttpException('Project not found', 404);
    
    project = {
      ...project,
      ...projectData
    }

    return this.projectRepository.save(project);
  }

  async findCompanyProjects(companyId: string): Promise<Project[]> {
    const company = await this.companyRepository.findOne({ where: { _id: new ObjectId(companyId) } });
    if (!company) throw new HttpException('Company not found', 404);

    return this.projectRepository.find({ where: { "company._id": new ObjectId(companyId) } });
  }

}