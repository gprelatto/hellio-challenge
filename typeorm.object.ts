import { MONGO_URI } from 'config';

export const typeormData = {
  type: 'mongodb',
  url: MONGO_URI,
  synchronize: false,
  logging: ['error'],
  useUnifiedTopology: true,
  ssl: false,
}