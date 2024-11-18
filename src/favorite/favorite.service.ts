import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Favorite, FavoriteType } from './interfaces/favorite.interface';
import { ResponseFavoriteDto } from './dto/response-favorite.dto';
import { TrackService } from '../track/track.service';
import { AlbumService } from '../album/album.service';
import { ArtistService } from '../artist/artist.service';
import { Artist } from '../artist/interfaces/artist.interface';
import { Track } from '../track/interfaces/track.interface';
import { Album } from '../album/interfaces/album.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class FavoriteService {
  constructor(
    @InjectRepository(Favorite)
    private favoriteRepository: Repository<Favorite>,
    private trackService: TrackService,
    private albumService: AlbumService,
    private artistService: ArtistService,
  ) {}

  async create(id: string, type: FavoriteType): Promise<ResponseFavoriteDto> {
    let entity: Artist | Track | Album;

    if (type === 'tracks') {
      entity = await this.trackService.findOne(id);
    }

    if (type === 'albums') {
      entity = await this.albumService.findOne(id);
    }

    if (type === 'artists') {
      entity = await this.artistService.findOne(id);
    }

    if (!entity) {
      throw new UnprocessableEntityException(
        `${type.toUpperCase()} with ID ${id} not found`,
      );
    }

    return (await this.favoriteRepository.save({
      [type]: [id],
    })) as unknown as ResponseFavoriteDto;
  }

  async findAll(): Promise<ResponseFavoriteDto> {
    const tracks = await this.trackService.findAll();
    const albums = await this.albumService.findAll();
    const artists = await this.artistService.findAll();

    const favorites = await this.favoriteRepository.find();

    return {
      artists: artists.filter((artist) =>
        favorites.some((fav) => fav.artists.includes(artist.id)),
      ),
      albums: albums.filter((album) =>
        favorites.some((fav) => fav.albums.includes(album.id)),
      ),
      tracks: tracks.filter((track) =>
        favorites.some((fav) => fav.tracks.includes(track.id)),
      ),
    };
  }

  async remove(id: string, type: FavoriteType): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const favorite = await this.favoriteRepository.findOne({ where: { type } });
    const isFavoriteIdExist = favorite && favorite[type].includes(id);

    if (!isFavoriteIdExist) {
      throw new NotFoundException(`Favorite ${type} with ID ${id} not found`);
    }

    favorite[type] = favorite[type].filter((itemId: string) => itemId !== id);

    await this.favoriteRepository.save(favorite);
  }
}
