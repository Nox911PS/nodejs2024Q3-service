import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { InMemoryDatabaseService } from '../db/in-memory-database.service';

@Module({
  providers: [UserService, InMemoryDatabaseService],
  controllers: [UserController],
})
export class UserModule {}
