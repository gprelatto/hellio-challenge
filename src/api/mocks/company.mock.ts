import { ProjectPermission, UserCompanyPermission } from '../../entities/user-company.entity';
import { User } from '../../entities/user.entity';
import { Company } from '../../entities/company.entity';
import { ObjectId } from 'mongodb';
import { Project, ProjectPriority, ProjectStatus } from '../../entities/project.entity';

const company : Company = new Company();
company._id = new ObjectId("67dd8633808134cf4979dfc3")
company.name = 'company';
company.industry = 'industry'; 


export const COMPANY_PERMISSON: UserCompanyPermission = new UserCompanyPermission();
COMPANY_PERMISSON._id = new ObjectId("67dd8633808134cf4979dfc3")
COMPANY_PERMISSON.company = company;
COMPANY_PERMISSON.permissions= [ProjectPermission.READ];

export const USER_USER: User = new User();
USER_USER._id = new ObjectId("67dd8633808134cf4979dfc3")
USER_USER.name = 'USER USER';
USER_USER.email = 'user@helio.com';
USER_USER.password = '$2b$10$Rl1cChlMDtiGG0hBrVqBIO3MKALOKNxp1uYscVW0VWk4UqEfXdYma';
USER_USER.companyPermissions = [COMPANY_PERMISSON]

export const USER_ADMIN: User = new User();
USER_ADMIN._id = new ObjectId("67dd8633808134cf4979dfc3")
USER_ADMIN.name = 'ADMIN USER';
USER_ADMIN.email = 'admin@helio.com';
USER_ADMIN.password = '$2b$10$Rl1cChlMDtiGG0hBrVqBIO3MKALOKNxp1uYscVW0VWk4UqEfXdYma';

export const USER_LIST: User[] = [USER_USER, USER_ADMIN];
export const COMPANY_PERMISSONS = [COMPANY_PERMISSON]
export const COMPANIES = [company]

const PROJECT_1: Project = new Project();
PROJECT_1._id = new ObjectId("67dd8633808134cf4979dfc4");
PROJECT_1.name = 'Project Alpha';
PROJECT_1.company = company;
PROJECT_1.description = 'This is the first project.';
PROJECT_1.status = ProjectStatus.ACTIVE;
PROJECT_1.priority = ProjectPriority.HIGH;
PROJECT_1.tags = ['alpha', 'important'];

const PROJECT_2: Project = new Project();
PROJECT_2._id = new ObjectId("67dd8633808134cf4979dfc5");
PROJECT_2.name = 'Project Beta';
PROJECT_2.company = company;
PROJECT_2.description = 'This is the second project.';
PROJECT_2.status = ProjectStatus.ARCHIVED;
PROJECT_2.priority = ProjectPriority.MEDIUM;
PROJECT_2.tags = ['beta', 'archived'];

export const PROJECT_LIST: Project[] = [PROJECT_1, PROJECT_2];

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
  find = jest.fn().mockImplementation(options => {return COMPANIES});
  findOne = jest.fn().mockImplementation(options => {return company});
}

class projectRepoMock {
  find = jest.fn().mockImplementation(options => {
    if (options && options.where && options.where['company._id']) {
      return PROJECT_LIST.filter(project => project.company._id.equals(options.where['company._id']));
    }
    return PROJECT_LIST;
  });
  findOne = jest.fn().mockImplementation(options => {
    if (options && options.where && options.where['company._id']) {
      return PROJECT_LIST.find(project => project.company._id.equals(options.where['company._id']));
    }
    return null;
  });
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
