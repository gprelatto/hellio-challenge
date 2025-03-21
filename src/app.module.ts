import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as ormConfig from '../ormconfig';
import { ApiModule } from './api/api.module';

@Module({
  imports: [TypeOrmModule.forRoot(ormConfig), ApiModule],
})
export class AppModule {}