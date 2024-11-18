import { Module } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { TrackService } from '../track/track.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Album } from './interfaces/album.entity';
import { Track } from '../track/interfaces/track.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Album, Track])],
  providers: [AlbumService, TrackService],
  controllers: [AlbumController],
  exports: [AlbumService],
})
export class AlbumModule {}
