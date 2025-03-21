import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/entities/user.entity';
import { UserCompanyPermission } from '@/entities/user-company.entity';
import { Company } from '@/entities/company.entity';
import { UserProjectPermission } from '@/entities/user-project.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserCompanyPermission, UserProjectPermission, Company])],
  providers: [UsersService],
  exports: [UsersService],
})
export class UserModule {}
