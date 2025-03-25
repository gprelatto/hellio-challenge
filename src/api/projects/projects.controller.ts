import {
  Controller,
  Body,
  UseGuards,
  Param,
  Get,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateProjectDTO, UpdateProjectDTO } from './projects.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../guards/roles.decorator';
import { ProjectService } from './projects.service';
import { Project } from '@/schemas/project.schema';
import { ProjectPermission } from '@/schemas/user-company.schema';

@ApiTags('Projects')
@Controller('v1/projects')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProjectController {
  constructor(private projectService: ProjectService) {}

  @ApiOperation({ summary: '[Extra] Creates a project for a company' })
  @Post('company/:companyId/project')
  @ApiBearerAuth('access-token')
  @Roles(ProjectPermission.WRITE)
  async createProject(
    @Param('companyId') id: string,
    @Body() project: CreateProjectDTO,
  ): Promise<Project> {
    return this.projectService.createProject(id, project);
  }

  @ApiOperation({
    summary:
      '[Task 1] Fetch all Projects for a company for a user that has access to.',
  })
  @Get('company/:companyId')
  @ApiBearerAuth('access-token')
  @Roles(ProjectPermission.READ)
  async findProjects(@Param('companyId') id: string): Promise<Project[]> {
    return this.projectService.findProjects(id);
  }

  @ApiOperation({
    summary:
      '[Task 2] Edit a single Project from a company they have access to.',
  })
  @Patch('company/:companyId/project/:projectId')
  @ApiBearerAuth('access-token')
  @Roles(ProjectPermission.WRITE)
  async updateProject(
    @Param('companyId') companyId: string,
    @Param('projectId') projectId: string,
    @Body() projectData: UpdateProjectDTO,
  ): Promise<Project> {
    return this.projectService.updateProject(companyId, projectId, projectData);
  }
}
