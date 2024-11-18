import { Injectable, NotFoundException } from '@nestjs/common';
import { InMemoryDatabaseService } from '../db/in-memory-database.service';
import { Album } from './interfaces/album.interface';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { CreateAlbumDto } from './dto/create-album.dto';
import { ResponseAlbumDto } from './dto/response-album.dto';
import { TrackService } from '../track/track.service';
import { v4 } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AlbumService {
  constructor(
    @InjectRepository(Album)
    private albumRepository: Repository<Album>,
    private trackService: TrackService,
  ) {}

  create(createArtistDto: CreateAlbumDto): Promise<ResponseAlbumDto> {
    const album: Album = this.albumRepository.create({
      ...createArtistDto,
      id: v4(),
    });
    return this.albumRepository.save(album);
  }

  findAll(): Promise<ResponseAlbumDto[]> {
    return this.albumRepository.find();
  }

  findOne(id: string): Promise<ResponseAlbumDto> {
    return this.albumRepository.findOne({ where: { id } });
  }

  async update(
    id: string,
    updateAlbumDto: UpdateAlbumDto,
  ): Promise<ResponseAlbumDto> {
    const artist = await this.albumRepository.findOne({ where: { id } });

    if (!artist) {
      throw new NotFoundException(`Album with ID ${id} not found`);
    }

    const updatedAlbum: Album = this.albumRepository.create({
      ...artist,
      name: updateAlbumDto.name,
      year: updateAlbumDto.year,
      artistId: updateAlbumDto.artistId,
    });

    return this.albumRepository.save(updatedAlbum);
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.albumRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Album with ID ${id} not found`);
    }

    const tracks = (await this.trackService.findAll()).filter(
      (track) => track.albumId === id,
    );

    tracks.forEach((track) => {
      this.trackService.update(track.id, { ...track, albumId: null });
    });

    return true;
  }
}
