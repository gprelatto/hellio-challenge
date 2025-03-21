import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/users.module';
import { CompanyModule } from './companies/companies.module';

@Module({
  imports: [AuthModule, UserModule, CompanyModule],
})
export class ApiModule {}
