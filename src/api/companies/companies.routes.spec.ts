import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from '../auth/auth.service';
import * as typeorm from 'typeorm';
import { JwtStrategy } from '../auth/jwt.strategy';
import { JWT_SECRET } from 'config';
import { CompanyController } from './companies.controller';
import { DataSourceMock } from '../mocks/company.mock';
import { CompanyService } from './companies.service';
import { UsersService } from '../users/users.service';

describe('UsersController - Role Access', () => {
  let app: INestApplication;
  let authService: AuthService;
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
      controllers: [CompanyController],
      providers: [
        {
          provide: typeorm.DataSource,
          useClass: DataSourceMock,
        },
        AuthService,
        UsersService,
        CompanyService,
        JwtStrategy,
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    authService = module.get<AuthService>(AuthService);

    const admin = await authService.validateUser('admin@helio.com', '123asd123');
    const adminResponse = await authService.login(admin);
    adminToken = adminResponse.access_token;

    const user = await authService.validateUser('user@helio.com', '123asd123');
    const userResponse = await authService.login(user);
    userToken = userResponse.access_token;
  });

  it('should allow USER to access GET /v1/companies/', async () => {
    const response = await request(app.getHttpServer()).get('/v1/companies').set('Authorization', `Bearer ${userToken}`);
    expect(response.status).toBe(200);
  });

  it('should fail if USER not Authed and try to access GET /v1/companies/', async () => {
    const response = await request(app.getHttpServer()).get('/v1/companies');
    expect(response.status).toBe(401);
  });

  it('should allow USER with WRITE access to PATCH /:companyId/project/:projectId', async () => {
    const response = await request(app.getHttpServer())
    .patch('/v1/companies/67dd8633808134cf4979dfc3/project/67dd8633808134cf4979dfc4')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ description: 'new description' });
    expect(response.status).toBe(200);
  });

  it('should deny USER with no WRITE access to PATCH /:companyId/project/:projectId', async () => {
    const response = await request(app.getHttpServer())
    .patch('/v1/companies/67dd8633808134cf4979dfc3/project/67dd8633808134cf4979dfc4')
    .set('Authorization', `Bearer ${userToken}`)
    .send({ description: 'new description' });
    expect(response.status).toBe(403);
  });

});
