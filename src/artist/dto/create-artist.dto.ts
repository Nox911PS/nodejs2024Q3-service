import { IsString, IsNotEmpty, MinLength, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateArtistDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  name: string;

  @IsBoolean()
  grammy: boolean;
}
