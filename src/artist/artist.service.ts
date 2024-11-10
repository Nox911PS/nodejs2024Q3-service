import { Injectable, NotFoundException } from '@nestjs/common';
import { InMemoryDatabaseService } from '../db/in-memory-database.service';
import { Artist } from './interfaces/artist.interface';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { CreateArtistDto } from './dto/create-artist.dto';
import { ResponseArtistDto } from './dto/response-artist.dto';
import { TrackService } from '../track/track.service';
import { AlbumService } from '../album/album.service';

@Injectable()
export class ArtistService {
  constructor(
    private db: InMemoryDatabaseService<Artist>,
    private trackService: TrackService,
    private albumService: AlbumService,
  ) {}

  create(createArtistDto: CreateArtistDto): ResponseArtistDto {
    const artist: Artist = {
      ...createArtistDto,
    };
    return this.db.create(artist);
  }

  findAll(): ResponseArtistDto[] {
    return this.db.findAll();
  }

  findOne(id: string): ResponseArtistDto {
    const artist = this.db.findOne(id);

    if (!artist) {
      throw new NotFoundException(`Artist with ID ${id} not found`);
    }

    return artist;
  }

  update(id: string, updateArtistdDto: UpdateArtistDto): ResponseArtistDto {
    const artist = this.db.findOne(id);

    if (!artist) {
      throw new NotFoundException(`Artist with ID ${id} not found`);
    }

    const updatedArtist: Artist = this.db.update(id, {
      ...artist,
      name: updateArtistdDto.name,
      grammy: updateArtistdDto.grammy,
    });

    return updatedArtist;
  }

  remove(id: string): boolean {
    const isArtistDeleted = this.db.remove(id);
    if (!isArtistDeleted) {
      throw new NotFoundException(`Artist with ID ${id} not found`);
    }

    const tracks = this.trackService
      .findAll()
      .filter((track) => track.artistId === id);

    const albums = this.albumService
      .findAll()
      .filter((album) => album.artistId === id);

    tracks.forEach((track) => {
      this.trackService.update(track.id, { ...track, artistId: null });
    });

    albums.forEach((album) => {
      this.albumService.update(album.id, { ...album, artistId: null });
    });

    return isArtistDeleted;
  }
}
