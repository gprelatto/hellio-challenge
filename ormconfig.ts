import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { typeormData } from 'typeorm.object';

const options = {
  ...typeormData,
  entities: ["src/entity/**/*{.js,.ts}"],
  migrations: [__dirname + '/migrations/*.ts'],
} as TypeOrmModuleOptions;

module.exports = options;
