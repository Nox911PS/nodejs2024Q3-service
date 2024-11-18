import { Module } from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { FavoriteController } from './favorite.controller';
import { TrackService } from '../track/track.service';
import { AlbumService } from '../album/album.service';
import { ArtistService } from '../artist/artist.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favorite } from './interfaces/favorite.entity';
import { Track } from '../track/interfaces/track.entity';
import { Album } from '../album/interfaces/album.entity';
import { Artist } from '../artist/interfaces/artist.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Favorite, Track, Album, Artist])],
  providers: [FavoriteService, TrackService, AlbumService, ArtistService],
  controllers: [FavoriteController],
})
export class FavoriteModule {}
