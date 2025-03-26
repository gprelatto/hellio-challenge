import { ProjectPermission } from '../../schemas/user-company.schema';

export const mockModel = {
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

export const findUserAdmin = {
  _id: '67dd8633808134cf4979dfc3',
  email: 'admin@helio.com',
  password: '$2b$10$MW2ADZBMXNnvnemXQkpUzuwzF/vluusX4ucUNEVQE99PEkdYwEroK',
};

export const rolesAdmin = [
  {
    user: {
      _id: '67dd8633808134cf4979dfc3',
      email: 'admin@helio.com',
    },
    company: {
      _id: '67dd8633808134cf4979dfc3',
      name: 'Helio',
    },
    permissions: [ProjectPermission.ADMIN],
  },
];

export const findUserUser = {
  _id: '67dd8633808134cf4979dfc3',
  email: 'user@helio.com',
  password: '$2b$10$MW2ADZBMXNnvnemXQkpUzuwzF/vluusX4ucUNEVQE99PEkdYwEroK',
};

export const rolesUser = [
  {
    user: {
      _id: '67dd8633808134cf4979dfc3',
      email: 'user@helio.com',
    },
    company: {
      _id: '67dd8633808134cf4979dfc3',
      name: 'Helio',
    },
    permissions: [ProjectPermission.READ],
  },
];
