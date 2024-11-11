import { Injectable } from '@nestjs/common';
import { InMemoryDatabaseService } from '../db/in-memory-database.service';
import { Favorite, FavoriteType } from './interfaces/favorite.interface';
import { ResponseFavoriteDto } from './dto/response-favorite.dto';
import { TrackService } from '../track/track.service';
import { AlbumService } from '../album/album.service';
import { ArtistService } from '../artist/artist.service';

@Injectable()
export class FavoriteService {
  constructor(
    private db: InMemoryDatabaseService<Favorite>,
    private trackService: TrackService,
    private albumService: AlbumService,
    private artistService: ArtistService,
  ) {}

  create(id: string, type: FavoriteType): ResponseFavoriteDto {
    return this.db.createFavorite(id, type) as unknown as ResponseFavoriteDto;
  }

  findAll(): ResponseFavoriteDto {
    const tracks = this.trackService.findAll();
    const albums = this.albumService.findAll();
    const artists = this.artistService.findAll();

    const favorites = this.db.getAllFavorite();

    return {
      artists: artists.filter((artist) =>
        favorites.artists.some((favArtistId) => favArtistId === artist.id),
      ),
      albums: albums.filter((album) =>
        favorites.albums.some((favAlbumId) => favAlbumId === album.id),
      ),
      tracks: tracks.filter((track) =>
        favorites.tracks.some((favTrackId) => favTrackId === track.id),
      ),
    };
  }

  // update(id: string, updateArtistdDto: UpdateFavoriteDto): ResponseFavoriteDto {
  //   const artist = this.db.findOne(id);
  //
  //   if (!artist) {
  //     throw new NotFoundException(`Artist with ID ${id} not found`);
  //   }
  //
  //   const updatedArtist: Artist = this.db.update(id, {
  //     ...artist,
  //     name: updateArtistdDto.name,
  //     grammy: updateArtistdDto.grammy,
  //   });
  //
  //   return updatedArtist;
  // }
  //
  // remove(id: string): boolean {
  //   const isArtistDeleted = this.db.remove(id);
  //   if (!isArtistDeleted) {
  //     throw new NotFoundException(`Artist with ID ${id} not found`);
  //   }
  //
  //   const tracks = this.trackService
  //     .findAll()
  //     .filter((track) => track.artistId === id);
  //
  //   const albums = this.albumService
  //     .findAll()
  //     .filter((album) => album.artistId === id);
  //
  //   tracks.forEach((track) => {
  //     this.trackService.update(track.id, { ...track, artistId: null });
  //   });
  //
  //   albums.forEach((album) => {
  //     this.albumService.update(album.id, { ...album, artistId: null });
  //   });
  //
  //   return isArtistDeleted;
  // }
}
