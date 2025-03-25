import {
  Controller,
  Body,
  UseGuards,
  Param,
  Post,
  Delete,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../guards/roles.decorator';
import {
  ProjectPermission,
  UserCompanyPermission,
} from '../../schemas/user-company.schema';
import { HandleRoleDTO } from './user-company-permissons.dto';
import { UserCompanyPermissonsService } from './user-company-permissons.service';

@ApiTags('Roles')
@Controller('v1/roles')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserCompanyPermissonsController {
  constructor(
    private userCompanyPermissionService: UserCompanyPermissonsService,
  ) {}

  @ApiOperation({
    summary: '[Task 3] Add access to another user access to resource.',
  })
  @Post('/:companyId')
  @ApiBearerAuth('access-token')
  @Roles(ProjectPermission.ADMIN)
  async AddRole(
    @Param('companyId') id: string,
    @Body() companyData: HandleRoleDTO,
  ): Promise<UserCompanyPermission> {
    return this.userCompanyPermissionService.addRole(
      companyData.email,
      id,
      companyData.permissons,
    );
  }

  @ApiOperation({
    summary: '[Task 4] Remove access to another user access to resource.',
  })
  @Delete('/:companyId')
  @ApiBearerAuth('access-token')
  @Roles(ProjectPermission.ADMIN)
  async RemoveRole(
    @Param('companyId') id: string,
    @Body() companyData: HandleRoleDTO,
  ): Promise<UserCompanyPermission> {
    return this.userCompanyPermissionService.removeRole(
      companyData.email,
      id,
      companyData.permissons,
    );
  }
}
