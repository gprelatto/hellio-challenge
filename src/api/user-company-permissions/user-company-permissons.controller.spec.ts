import { Test, TestingModule } from '@nestjs/testing';
import { UserCompanyPermissonsController } from './user-company-permissons.controller';
import { UserCompanyPermissonsService } from './user-company-permissons.service';
import {
  ProjectPermission,
  UserCompanyPermission,
} from '../../schemas/user-company.schema';
import { INestApplication } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import * as request from 'supertest';
import { JWT_SECRET } from 'config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CompanyService } from '../companies/companies.service';
import { JwtStrategy } from '../auth/jwt.strategy';
import * as bcrypt from 'bcrypt';

const mockModel = {
  find: jest.fn().mockImplementation(() => ({
    populate: jest.fn().mockImplementation(() => ({
      populate: jest.fn().mockImplementation(() => ({
        exec: jest.fn(),
      })),
    })),    
    exec: jest.fn(),
  })),
  findOne: jest.fn().mockImplementation(() => ({
    populate: jest.fn().mockImplementation(() => ({
      exec: jest.fn(),
    })),
    exec: jest.fn(),
  })),
  create: jest.fn(),
  updateOne: jest.fn(),
  deleteOne: jest.fn(),
};

describe('UserCompanyPermissonsController', () => {
  let controller: UserCompanyPermissonsController;
  let service: UserCompanyPermissonsService;
  let app: INestApplication;
  let authService: AuthService;
  let userService: UsersService;
  let adminToken: string;
  let userToken: string;

  beforeAll(async () => {
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
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    controller = module.get<UserCompanyPermissonsController>(
      UserCompanyPermissonsController,
    );
    service = module.get<UserCompanyPermissonsService>(
      UserCompanyPermissonsService,
    );

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UsersService>(UsersService);

    
    const hashPassword = await bcrypt.hash('Inicio.es1', 10);

    jest.spyOn(userService, 'findById').mockReturnValue(
      Promise.resolve({
        _id: '67dd8633808134cf4979dfc3',
        email: 'admin@helio.com',
        password: hashPassword
      } as any),
    );
    
    jest.spyOn(userService, 'findByEmail').mockReturnValue(
      Promise.resolve({
        _id: '67dd8633808134cf4979dfc3',
        email: 'admin@helio.com',
        password: hashPassword
      } as any),
    );

    jest.spyOn(service, 'getUserCompanyRoles').mockReturnValue(
      Promise.resolve([{
        user: {
          _id: '67dd8633808134cf4979dfc3',
          email: 'admin@helio.com',
        },
        company: {
          _id: '67dd8633808134cf4979dfc3',
          name: 'Helio',
        },
        permissions: [ProjectPermission.ADMIN],
      }] as any),
    );

    const admin = await authService.validateUser(
      'admin@helio.com',
      'Inicio.es1',
    );
    const adminResponse = await authService.login(admin);
    adminToken = adminResponse.access_token;
  });

  it('should allow USER to access POST /v1/roles/:id', async () => {
    jest
      .spyOn(service, 'addRole')
      .mockResolvedValue({} as UserCompanyPermission);

    jest
      .spyOn(service, 'addRole')
      .mockResolvedValue({} as UserCompanyPermission);

    const response = await request(app.getHttpServer())
      .post('/v1/roles/67dd8633808134cf4979dfc3')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        email: 'user@helio.com',
        permissions: [ProjectPermission.WRITE],
      });

    expect(response.status).toBe(201);
  });
});
