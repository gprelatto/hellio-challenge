import { Injectable } from '@nestjs/common';
import { UserCompanyPermission } from '../../entities/user-company.entity';
import { DataSource } from 'typeorm';
import { User } from '../../entities/user.entity';
import { UserProjectPermission } from '../../entities/user-project.entity';

@Injectable()
export class UsersService {
  constructor(private readonly dataSource: DataSource) {}

  private userRepository = this.dataSource.getMongoRepository(User);
  private userCompanyPermissionRepository = this.dataSource.getMongoRepository(UserCompanyPermission);
  private userProjectPermissionRepository = this.dataSource.getMongoRepository(UserProjectPermission);


  async getCompanyPermissons(email: string): Promise<UserCompanyPermission[]> {
    return this.userCompanyPermissionRepository.find({ where : { "user.email": email } });
  }

  async getProjectPermissons(email: string): Promise<UserProjectPermission[]> {
    return this.userProjectPermissionRepository.find({ where : { "user.email": email } });
  }
  
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({where : {email}})
  } 
  
  async createUser(userData: Partial<User>): Promise<User> {
    return this.userRepository.save(userData);;
  }
}