import { Module } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { InMemoryDatabaseService } from '../db/in-memory-database.service';

@Module({
  providers: [AlbumService, InMemoryDatabaseService],
  controllers: [AlbumController],
})
export class AlbumModule {}
