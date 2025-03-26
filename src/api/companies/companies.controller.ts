import { Controller, Post, Body, Request, UseGuards, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CompanyService } from './companies.service';
import { CreateCompanyDTO } from './companies.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Company } from '../../schemas/company.schema';

@ApiTags('Companies')
@Controller('v1/companies')
@UseGuards(JwtAuthGuard)
export class CompanyController {
  constructor(private companiesService: CompanyService) {}

  @ApiOperation({ summary: 'Creates a company' })
  @Post('/')
  @ApiBearerAuth('access-token')
  async createCompany(@Request() req, @Body() companyData: CreateCompanyDTO): Promise<Company> {
    return this.companiesService.createCompany(req.user.email, companyData);
  }

  @ApiOperation({ summary: 'Get lists of companies' })
  @Get('/')
  @ApiBearerAuth('access-token')
  async getCompanies(): Promise<Company[]> {
    return this.companiesService.getCompanies();
  }
}
