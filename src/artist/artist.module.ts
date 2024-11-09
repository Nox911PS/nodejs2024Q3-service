import { Module } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { ArtistController } from './artist.controller';
import { InMemoryDatabaseService } from '../db/in-memory-database.service';

@Module({
  providers: [ArtistService, InMemoryDatabaseService],
  controllers: [ArtistController],
})
export class ArtistModule {}
