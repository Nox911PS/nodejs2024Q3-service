import { EntityRepository, Repository } from 'typeorm';
import { Artist } from './interfaces/artist.entity';

@EntityRepository(Artist)
export class ArtistRepository extends Repository<Artist> {}
