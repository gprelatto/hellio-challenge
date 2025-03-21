import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth/auth.service';
import { USER_USER } from '../mocks/user.mock';
import { CompanyService } from './companies.service';

describe('AuthService - Payload Tests', () => {
  let authService: AuthService;
  let usersService: Partial<UsersService>;
  let jwtService: Partial<JwtService>;

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
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
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
});
