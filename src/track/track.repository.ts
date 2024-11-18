import { EntityRepository, Repository } from 'typeorm';
import { Track } from './interfaces/track.entity';

@EntityRepository(Track)
export class TrackRepository extends Repository<Track> {}
