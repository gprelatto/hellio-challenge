import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserCompanyPermission, UserCompanyPermissionSchema } from '@/schemas/user-company.schema';
import { UserCompanyPermissonsService } from './user-company-permissons.service';
import { Company, CompanySchema } from '@/schemas/company.schema';
import { User, UserSchema } from '@/schemas/user.schema';
import { UserModule } from '../users/users.module';
import { CompanyModule } from '../companies/companies.module';
import { UserCompanyPermissonsController } from './user-company-permissons.controller';

@Module({
  imports: [MongooseModule.forFeature([
    { name: UserCompanyPermission.name, schema: UserCompanyPermissionSchema },
    { name: Company.name, schema: CompanySchema },
    { name: User.name, schema: UserSchema },
  ])
  , UserModule, CompanyModule
  ],
  controllers: [UserCompanyPermissonsController],
  providers: [UserCompanyPermissonsService],
  exports: [UserCompanyPermissonsService],
})
export class UserCompanyPermissionModule {}
