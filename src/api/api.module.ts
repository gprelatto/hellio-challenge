import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/users.module';
import { CompanyModule } from './companies/companies.module';
import { ProjectsModule } from './projects/projects.module';
import { UserCompanyPermissionModule } from './user-company-permissions/user-company-permissons.module';
import { PermissionsModule } from './permissions/permissions.module';

@Module({
  imports: [AuthModule, UserModule, CompanyModule, ProjectsModule, UserCompanyPermissionModule, PermissionsModule],
})
export class ApiModule {}
