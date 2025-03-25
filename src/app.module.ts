import { Module } from '@nestjs/common';
import { ApiModule } from './api/api.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MONGO_URI } from 'config';
@Module({
  imports: [MongooseModule.forRoot(MONGO_URI), ApiModule]
})
export class AppModule {}