import { Module } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { SharedModule } from '../shared/shared.module';
import { TrackService } from '../track/track.service';

@Module({
  imports: [SharedModule],
  providers: [AlbumService, TrackService],
  controllers: [AlbumController],
  exports: [AlbumService],
})
export class AlbumModule {}
