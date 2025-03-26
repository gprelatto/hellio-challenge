import { Test, TestingModule } from '@nestjs/testing';
import { UserCompanyPermissonsController } from './user-company-permissons.controller';
import { UserCompanyPermissonsService } from './user-company-permissons.service';
import { ProjectPermission, UserCompanyPermission } from '../../schemas/user-company.schema';
import { INestApplication } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import * as request from 'supertest';
import { JWT_SECRET } from 'config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CompanyService } from '../companies/companies.service';
import { JwtStrategy } from '../auth/jwt.strategy';
import { PermissionService } from '../permissions/permission.service';
import { findUserAdmin, findUserUser, mockModel, rolesAdmin, rolesUser } from './user-company-permissons.mocks';

describe('UserCompanyPermissonsController', () => {
  let controller: UserCompanyPermissonsController;
  let service: UserCompanyPermissonsService;
  let app: INestApplication;
  let authService: AuthService;
  let userService: UsersService;
  let adminToken: string;
  let userToken: string;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule,
        JwtModule.register({
          secret: JWT_SECRET,
          signOptions: { expiresIn: '1h' },
        }),
      ],
      controllers: [UserCompanyPermissonsController],
      providers: [
        {
          provide: 'UserModel',
          useValue: mockModel,
        },
        {
          provide: 'CompanyModel',
          useValue: mockModel,
        },
        {
          provide: 'UserCompanyPermissionModel',
          useValue: mockModel,
        },
        UserCompanyPermissonsService,
        AuthService,
        UsersService,
        CompanyService,
        JwtStrategy,
        PermissionService,
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    controller = module.get<UserCompanyPermissonsController>(UserCompanyPermissonsController);
    service = module.get<UserCompanyPermissonsService>(UserCompanyPermissonsService);

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UsersService>(UsersService);
  });

  it('should reject not authed call', async () => {
    jest.spyOn(service, 'addRole').mockResolvedValue({} as UserCompanyPermission);

    const response = await request(app.getHttpServer())
      .post('/v1/roles/67dd8633808134cf4979dfc3')
      .send({
        email: 'user@helio.com',
        permissions: [ProjectPermission.WRITE],
      });

    expect(response.status).toBe(401);
  });

  it('should allow USER with ADMIN rights to access POST /v1/roles/:id', async () => {
    jest.spyOn(service, 'addRole').mockResolvedValue({} as UserCompanyPermission);
    jest.spyOn(userService, 'findById').mockReturnValue(Promise.resolve(findUserAdmin as any));
    jest.spyOn(userService, 'findByEmail').mockReturnValue(Promise.resolve(findUserAdmin as any));
    jest.spyOn(service, 'getUserCompanyRoles').mockReturnValue(Promise.resolve(rolesAdmin as any));
    
    const admin = await authService.validateUser('admin@helio.com', 'Inicio.es1');
    const adminResponse = await authService.login(admin);
    adminToken = adminResponse.access_token;

    const response = await request(app.getHttpServer())
      .post('/v1/roles/67dd8633808134cf4979dfc3')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        email: 'user@helio.com',
        permissions: [ProjectPermission.WRITE],
      });

    expect(response.status).toBe(201);
  });

  it('should not allow USER without ADMIN rights to access POST /v1/roles/:id', async () => {
    jest.spyOn(service, 'addRole').mockResolvedValue({} as UserCompanyPermission);
    jest.spyOn(userService, 'findById').mockReturnValue(Promise.resolve(findUserUser as any));
    jest.spyOn(userService, 'findByEmail').mockReturnValue(Promise.resolve(findUserUser as any));
    jest.spyOn(service, 'getUserCompanyRoles').mockReturnValue(Promise.resolve(rolesUser as any));

    const user = await authService.validateUser('user@helio.com', 'Inicio.es1');
    const userResponse = await authService.login(user);
    userToken = userResponse.access_token;

    const response = await request(app.getHttpServer())
      .post('/v1/roles/67dd8633808134cf4979dfc3')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        email: 'user@helio.com',
        permissions: [ProjectPermission.WRITE],
      });

    expect(response.status).toBe(403);
  });
});
