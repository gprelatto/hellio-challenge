import { ProjectPermission, UserCompanyPermission } from '../../entities/user-company.entity';
import { User } from '../../entities/user.entity';
import { Company } from '../../entities/company.entity';

export const USER_USER: User = new User();
USER_USER.name = 'USER USER';
USER_USER.email = 'user@helio.com';
USER_USER.password = '$2b$10$Rl1cChlMDtiGG0hBrVqBIO3MKALOKNxp1uYscVW0VWk4UqEfXdYma';
USER_USER.companyPermissions = [];

export const USER_ADMIN: User = new User();
USER_ADMIN.name = 'ADMIN USER';
USER_ADMIN.email = 'admin@helio.com';
USER_ADMIN.password = '$2b$10$Rl1cChlMDtiGG0hBrVqBIO3MKALOKNxp1uYscVW0VWk4UqEfXdYma';

export const USER_LIST: User[] = [USER_USER, USER_ADMIN];

const company : Company = new Company();
company.name = 'company';
company.industry = 'industry'; 

export const COMPANY_PERMISSON: UserCompanyPermission = new UserCompanyPermission();
COMPANY_PERMISSON.user= USER_USER;
COMPANY_PERMISSON.company = company;
COMPANY_PERMISSON.permissions= [ProjectPermission.READ];

export const COMPANY_PERMISSONS = [COMPANY_PERMISSON]
export const COMPANIES = [company]

class DataSourceManagerMock {
  save = jest.fn().mockReturnValue(Promise.resolve(USER_USER));
}

class UserRepoMock {
  find = jest.fn().mockImplementation(options => {
    if (options && options.where && options.where.email) {
      return USER_LIST.filter(user => user.email === options.where.email);
    }
    return USER_LIST;
  });

  findOne = jest.fn().mockImplementation(options => {
    if (options && options.where) {
      const { email } = options.where;
      return USER_LIST.find(user => user.email === email || user.email === email);
    }
    return null;
  });
}

class userCompanyRepoMock {
  find = jest.fn().mockImplementation(options => {return COMPANY_PERMISSONS});
  findOne = jest.fn().mockImplementation(options => {return COMPANY_PERMISSON});
}

class userProjectRepoMock {
  find = jest.fn().mockImplementation(options => {return {}});
  findOne = jest.fn().mockImplementation(options => {return []});
}

class companyRepoMock {
  find = jest.fn().mockImplementation(options => {return company});
  findOne = jest.fn().mockImplementation(options => {return COMPANIES});
}

class projectRepoMock {
  find = jest.fn().mockImplementation(options => {return {}});
  findOne = jest.fn().mockImplementation(options => {return []});
}

export class DataSourceMock {
  manager = new DataSourceManagerMock();

  getMongoRepository(type: any) {
    switch (type.name) {
      case 'User': return new UserRepoMock();
      case 'UserCompanyPermission': return new userCompanyRepoMock();
      case 'UserProjectPermission': return new userProjectRepoMock();
      case 'Company': return new companyRepoMock();
      case 'Project': return new projectRepoMock();
      default: throw new Error(`No mock repository found for type: ${type}`);
    }
  }
}
