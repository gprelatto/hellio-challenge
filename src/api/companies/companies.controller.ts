import { Controller, Post, Body, Request, UseGuards, Param, Get, Patch, Delete } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CompanyService } from './companies.service';
import { CreateCompanyDTO, CreateProjectDTO, InviteMemberDTO, UpdateProjectDTO } from './companies.dto';
import { Company } from '../../entities/company.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../guards/roles.decorator';
import { ProjectPermission, UserCompanyPermission } from '../../entities/user-company.entity';
import { Project } from '../../entities/project.entity';

@ApiTags('Companies')
@Controller('v1/companies')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CompanyController {
  constructor(private companiesService: CompanyService) {}

  @ApiOperation({ summary: 'Creates a company' })
  @Post('/')
  @ApiBearerAuth('access-token')
  async createCompany(@Request() req, @Body() companyData: CreateCompanyDTO) : Promise<Company> {
    return this.companiesService.createCompany(req.user.email, companyData);
  }

  @ApiOperation({ summary: 'Get lists of companies' })
  @Get('/')
  @ApiBearerAuth('access-token')
  async getCompanies() : Promise<Company[]> {
    return this.companiesService.getCompanies();
  }

  @ApiOperation({ summary: '[Only Write Access] Creates a project for a company' })
  @Post('/:companyId/project')
  @ApiBearerAuth('access-token')
  @Roles(ProjectPermission.WRITE)
  async createProject(@Param('companyId') id: string, @Body() project: CreateProjectDTO) : Promise<Project> {
    return this.companiesService.createCompanyProject(id, project);
  }

  @ApiOperation({ summary: '[Task 1] Fetch all Projects for a company for a user that has access to.' })
  @Get('/:companyId/project')
  @ApiBearerAuth('access-token')
  @Roles(ProjectPermission.READ)
  async findProjects(@Param('companyId') id: string) : Promise<Project[]> {
    return this.companiesService.findCompanyProjects(id);
  }

  @ApiOperation({ summary: '[Task 2] Edit a single Project from a company they have access to.' })
  @Patch('/:companyId/project/:projectId')
  @ApiBearerAuth('access-token')
  @Roles(ProjectPermission.WRITE)
  async updateProject(@Param('companyId') companyId: string, @Param('projectId') projectId: string, @Body() projectData: UpdateProjectDTO) : Promise<Project> {
    return this.companiesService.updateCompanyProject(companyId, projectId, projectData);
  }
  
  @ApiOperation({ summary: '[Task 3] Add access to another user access to resource.' })
  @Post('/:companyId/roles')
  @ApiBearerAuth('access-token')
  @Roles(ProjectPermission.ADMIN)
  async AddRole(@Param('companyId') id: string, @Body() companyData: InviteMemberDTO) : Promise<UserCompanyPermission> {
    return this.companiesService.addRoleCompany(companyData.email, id, companyData.permissons);
  }


  @ApiOperation({ summary: '[Task 4] Remove access to another user access to resource.' })
  @Delete('/:companyId/roles')
  @ApiBearerAuth('access-token')
  @Roles(ProjectPermission.ADMIN)
  async RemoveRole(@Param('companyId') id: string, @Body() companyData: InviteMemberDTO) : Promise<UserCompanyPermission> {
    return this.companiesService.removeRoleCompany(companyData.email, id, companyData.permissons);
  }
}
