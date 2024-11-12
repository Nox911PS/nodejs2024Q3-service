import { Injectable, NotFoundException } from '@nestjs/common';
import { InMemoryDatabaseService } from '../db/in-memory-database.service';
import { Track } from './interfaces/track.interface';
import { UpdateTrackDto } from './dto/update-track.dto';
import { CreateTrackDto } from './dto/create-track.dto';
import { ResponseTrackDto } from './dto/response-track.dto';
import { v4 } from 'uuid';

@Injectable()
export class TrackService {
  constructor(private db: InMemoryDatabaseService<Track>) {}

  create(createTrackDto: CreateTrackDto): ResponseTrackDto {
    const track: Track = {
      ...createTrackDto,
      id: v4(),
    };
    return this.db.create(track);
  }

  findAll(): ResponseTrackDto[] {
    return this.db.findAll();
  }

  findOne(id: string): ResponseTrackDto {
    return this.db.findOne(id);
  }

  update(id: string, updateTrackDto: UpdateTrackDto): ResponseTrackDto {
    const track = this.db.findOne(id);

    if (!track) {
      throw new NotFoundException(`Track with ID ${id} not found`);
    }

    const updatedTrack: Track = this.db.update(id, {
      ...track,
      name: updateTrackDto.name,
      artistId: updateTrackDto.artistId,
      albumId: updateTrackDto.albumId,
      duration: updateTrackDto.duration,
    });

    return updatedTrack;
  }

  remove(id: string): boolean {
    const isTrackDeleted = this.db.remove(id);
    if (!isTrackDeleted) {
      throw new NotFoundException(`Track with ID ${id} not found`);
    }

    return isTrackDeleted;
  }
}
