import { MONGO_URI } from 'config';

export const typeormData = {
  type: 'mongodb',
  host: "localhost",
  port: 27017,
  database: "helio_challenge",  
  synchronize: false,
  logging: ['error'],
  useUnifiedTopology: true,
  ssl: false,
  autoLoadEntities: true,
}
