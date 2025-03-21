import { Controller, Post, Body, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CompanyService } from './companies.service';
import { CreateCompanyDTO } from './companies.dto';
import { Company } from 'src/entities/company.entity';

@ApiTags('Auth')
@Controller('v1/companies')
export class AuthController {
  constructor(private companiesService: CompanyService) {}

  @ApiOperation({ summary: 'Creates a company' })
  @Post('/')
  @ApiBearerAuth('access-token')
  async createCompany(@Request() req, @Body() companyData: CreateCompanyDTO) : Promise<Company> {
    return this.companiesService.createCompany(req.user.id, companyData);
  }

}
