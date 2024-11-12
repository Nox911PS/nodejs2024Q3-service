import { Expose } from 'class-transformer';

export class ResponseArtistDto {
  @Expose()
  id?: string;
  @Expose()
  name: string;
  @Expose()
  grammy: boolean;
}
