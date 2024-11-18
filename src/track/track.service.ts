import { Injectable, NotFoundException } from '@nestjs/common';
import { InMemoryDatabaseService } from '../db/in-memory-database.service';
import { Track } from './interfaces/track.interface';
import { UpdateTrackDto } from './dto/update-track.dto';
import { CreateTrackDto } from './dto/create-track.dto';
import { ResponseTrackDto } from './dto/response-track.dto';
import { v4 } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { Artist } from '../artist/interfaces/artist.interface';
import { Repository } from 'typeorm';

@Injectable()
export class TrackService {
  constructor(
    @InjectRepository(Track)
    private trackRepository: Repository<Track>,
  ) {}

  create(createTrackDto: CreateTrackDto): Promise<ResponseTrackDto> {
    const track: Track = this.trackRepository.create({
      ...createTrackDto,
      id: v4(),
    });
    return this.trackRepository.save(track);
  }

  findAll(): Promise<ResponseTrackDto[]> {
    return this.trackRepository.find();
  }

  findOne(id: string): Promise<ResponseTrackDto> {
    return this.trackRepository.findOne({ where: { id } });
  }

  async update(
    id: string,
    updateTrackDto: UpdateTrackDto,
  ): Promise<ResponseTrackDto> {
    const track = await this.trackRepository.findOne({ where: { id } });

    if (!track) {
      throw new NotFoundException(`Track with ID ${id} not found`);
    }

    const updatedTrack: Track = this.trackRepository.create({
      ...track,
      name: updateTrackDto.name,
      artistId: updateTrackDto.artistId,
      albumId: updateTrackDto.albumId,
      duration: updateTrackDto.duration,
    });

    return this.trackRepository.save(updatedTrack);
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.trackRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Track with ID ${id} not found`);
    }

    return true;
  }
}
