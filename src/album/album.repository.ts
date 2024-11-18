import { EntityRepository, Repository } from 'typeorm';
import { Album } from './interfaces/album.entity';

@EntityRepository(Album)
export class AlbumRepository extends Repository<Album> {}
