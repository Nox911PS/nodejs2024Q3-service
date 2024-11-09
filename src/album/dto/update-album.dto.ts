import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateAlbumDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  name: string;

  @IsNumber()
  year: number;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  artistId: string | null;
}
