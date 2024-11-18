import { Injectable, NotFoundException } from '@nestjs/common';
import { InMemoryDatabaseService } from '../db/in-memory-database.service';
import { Artist } from './interfaces/artist.interface';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { CreateArtistDto } from './dto/create-artist.dto';
import { ResponseArtistDto } from './dto/response-artist.dto';
import { TrackService } from '../track/track.service';
import { AlbumService } from '../album/album.service';
import { v4 } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ArtistService {
  constructor(
    @InjectRepository(Artist)
    private artistRepository: Repository<Artist>,
    private trackService: TrackService,
    private albumService: AlbumService,
  ) {}

  create(createArtistDto: CreateArtistDto): Promise<ResponseArtistDto> {
    const artist: Artist = this.artistRepository.create({
      ...createArtistDto,
      id: v4(),
    });
    return this.artistRepository.save(artist);
  }

  findAll(): Promise<ResponseArtistDto[]> {
    return this.artistRepository.find();
  }

  findOne(id: string): Promise<ResponseArtistDto> {
    return this.artistRepository.findOne({ where: { id } });
  }

  async update(
    id: string,
    updateArtistDto: UpdateArtistDto,
  ): Promise<ResponseArtistDto> {
    const artist = await this.artistRepository.findOne({ where: { id } });

    if (!artist) {
      throw new NotFoundException(`Artist with ID ${id} not found`);
    }

    const updatedArtist: Artist = this.artistRepository.create({
      ...artist,
      name: updateArtistDto.name,
      grammy: updateArtistDto.grammy,
    });

    return this.artistRepository.save(updatedArtist);
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.artistRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Artist with ID ${id} not found`);
    }

    const tracks = (await this.trackService.findAll()).filter(
      (track) => track.artistId === id,
    );

    const albums = (await this.albumService.findAll()).filter(
      (album) => album.artistId === id,
    );

    for (const track of tracks) {
      await this.trackService.update(track.id, { ...track, artistId: null });
    }

    for (const album of albums) {
      await this.albumService.update(album.id, { ...album, artistId: null });
    }

    return true;
  }
}
