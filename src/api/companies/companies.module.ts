import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyService } from './companies.service';
import { Company } from '@/entities/company.entity';
import { CompanyController } from './companies.controller';
import { Project } from '@/entities/project.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Company, Project])],
  controllers: [CompanyController],
  providers: [CompanyService],
  exports: [CompanyService],
})
export class CompanyModule {}
