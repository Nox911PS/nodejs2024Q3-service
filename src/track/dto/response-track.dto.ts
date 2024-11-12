import { Expose } from 'class-transformer';

export class ResponseTrackDto {
  @Expose()
  id?: string;
  @Expose()
  name: string;
  @Expose()
  artistId: string;
  @Expose()
  albumId: string;
  @Expose()
  duration: number;
}
