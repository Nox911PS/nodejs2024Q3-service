import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { InMemoryDatabaseService } from '../db/in-memory-database.service';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [SharedModule],
  providers: [UserService, InMemoryDatabaseService],
  controllers: [UserController],
})
export class UserModule {}
