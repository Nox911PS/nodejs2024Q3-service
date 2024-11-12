import { Module } from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { FavoriteController } from './favorite.controller';
import { InMemoryDatabaseService } from '../db/in-memory-database.service';
import { TrackService } from '../track/track.service';
import { AlbumService } from '../album/album.service';
import { SharedModule } from '../shared/shared.module';
import { ArtistService } from '../artist/artist.service';

@Module({
  imports: [SharedModule],
  providers: [FavoriteService, TrackService, AlbumService, ArtistService],
  controllers: [FavoriteController],
})
export class FavoriteModule {}
