import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JWT_SECRET } from 'config';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserCompanyPermission, UserCompanyPermissionSchema } from '@/schemas/user-company.schema';
import { Company, CompanySchema } from '@/schemas/company.schema';
import { User, UserSchema } from '@/schemas/user.schema';
import { UserModule } from '../users/users.module';
import { UserCompanyPermissionModule } from '../user-company-permissions/user-company-permissons.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserCompanyPermission.name, schema: UserCompanyPermissionSchema },
      { name: Company.name, schema: CompanySchema },
      { name: User.name, schema: UserSchema },
    ]),
    UserModule,
    UserCompanyPermissionModule,
    PassportModule,
    JwtModule.register({
      secret: JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
