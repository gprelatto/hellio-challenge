import { Module } from '@nestjs/common';
import { ProjectController } from './projects.controller';
import { ProjectService } from './projects.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Project, ProjectSchema } from '@/schemas/project.schema';
import { CompanyService } from '../companies/companies.service';
import { UserCompanyPermission, UserCompanyPermissionSchema } from '@/schemas/user-company.schema';
import { Company, CompanySchema } from '@/schemas/company.schema';
import { User, UserSchema } from '@/schemas/user.schema';
import { CompanyModule } from '../companies/companies.module';
import { PermissionService } from '../permissions/permission.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserCompanyPermission.name, schema: UserCompanyPermissionSchema },
      { name: Company.name, schema: CompanySchema },
      { name: User.name, schema: UserSchema },
      { name: Project.name, schema: ProjectSchema },
    ]),
    CompanyModule,
  ],
  controllers: [ProjectController],
  providers: [ProjectService, PermissionService],
  exports: [ProjectService],
})
export class ProjectsModule {}
