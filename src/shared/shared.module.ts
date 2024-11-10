import { Module } from '@nestjs/common';
import { InMemoryDatabaseService } from '../db/in-memory-database.service';

@Module({
  providers: [InMemoryDatabaseService],
  exports: [InMemoryDatabaseService],
})
export class SharedModule {}
