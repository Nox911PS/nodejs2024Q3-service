import { Expose } from 'class-transformer';

export class ResponseAlbumDto {
  @Expose()
  id?: string;
  @Expose()
  name: string;
  @Expose()
  year: number;
  @Expose()
  artistId: string | null;
}
