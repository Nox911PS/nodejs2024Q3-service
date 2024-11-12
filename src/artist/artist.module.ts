import { Module } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { ArtistController } from './artist.controller';
import { InMemoryDatabaseService } from '../db/in-memory-database.service';
import { TrackService } from '../track/track.service';
import { AlbumService } from '../album/album.service';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [SharedModule],
  providers: [ArtistService, TrackService, AlbumService],
  controllers: [ArtistController],
})
export class ArtistModule {}
