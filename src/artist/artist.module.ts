import { Module } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { ArtistController } from './artist.controller';
import { TrackService } from '../track/track.service';
import { AlbumService } from '../album/album.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Artist } from './interfaces/artist.entity';
import { TrackRepository } from '../track/track.repository';
import { Track } from '../track/interfaces/track.entity';
import { Album } from '../album/interfaces/album.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Artist, Track, Album])],
  providers: [ArtistService, TrackService, AlbumService],
  controllers: [ArtistController],
})
export class ArtistModule {}
