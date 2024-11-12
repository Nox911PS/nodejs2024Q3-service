import { Module } from '@nestjs/common';
import { TrackService } from './track.service';
import { TrackController } from './track.controller';
import { InMemoryDatabaseService } from '../db/in-memory-database.service';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [SharedModule],

  providers: [TrackService],
  controllers: [TrackController],
  exports: [TrackService],
})
export class TrackModule {}
