import { IsString } from 'class-validator';

export class ResponseLoginDto {
  @IsString()
  accessToken: string;

  @IsString()
  refreshToken: string;
}
