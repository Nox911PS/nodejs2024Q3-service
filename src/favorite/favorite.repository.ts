import { EntityRepository, Repository } from 'typeorm';
import { Favorite } from './interfaces/favorite.entity';

@EntityRepository(Favorite)
export class FavoriteRepository extends Repository<Favorite> {}
