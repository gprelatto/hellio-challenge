import { forwardRef, Module } from '@nestjs/common';
import { CompanyService } from './companies.service';
import { CompanyController } from './companies.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Company, CompanySchema } from '../../schemas/company.schema';
import { UserCompanyPermission, UserCompanyPermissionSchema } from '../../schemas/user-company.schema';
import { User, UserSchema } from '../../schemas/user.schema';
import { Project, ProjectSchema } from '../../schemas/project.schema';
import { UserModule } from '../users/users.module';
import { UserCompanyPermissionModule } from '../user-company-permissions/user-company-permissons.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserCompanyPermission.name, schema: UserCompanyPermissionSchema },
      { name: Company.name, schema: CompanySchema },
      { name: User.name, schema: UserSchema },
      { name: Project.name, schema: ProjectSchema },
    ]),
    UserModule,
    forwardRef(() => UserCompanyPermissionModule),
  ],
  controllers: [CompanyController],
  providers: [CompanyService],
  exports: [CompanyService],
})
export class CompanyModule {}
