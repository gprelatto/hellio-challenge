import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth/auth.service';
import { DataSourceMock, PROJECT_LIST, USER_USER } from '../mocks/company.mock';
import { CompanyService } from './companies.service';
import * as typeorm from 'typeorm';


describe('AuthService - Payload Tests', () => {
  let authService: AuthService;
  let usersService: Partial<UsersService>;
  let jwtService: Partial<JwtService>;
  let companyService: Partial<CompanyService>;

  beforeEach(async () => {
    usersService = {
      findByEmail: jest.fn(),
      getCompanyPermissons: jest.fn(),
    };

    jwtService = {
      sign: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        CompanyService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
        {
          provide: typeorm.DataSource,
          useClass: DataSourceMock,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    companyService =  module.get<CompanyService>(CompanyService);
  });

  it('should generate a payload with correct email and companyPermissions', async () => {
    const mockToken = 'mockJwtToken';
    jest.spyOn(jwtService, 'sign').mockReturnValue(mockToken);

    const result = await authService.login(USER_USER);

    expect(jwtService.sign).toHaveBeenCalledWith({
      email: USER_USER.email,
      companyPermissions: USER_USER.companyPermissions,
    });
    expect(result).toEqual({ access_token: mockToken });
  });

  it('Should fetch all projects for a company', async () => {
    const result = await companyService.findCompanyProjects("67dd8633808134cf4979dfc3");
    expect(result).toEqual(PROJECT_LIST);
  });
});
