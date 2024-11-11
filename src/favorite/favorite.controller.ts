import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { ResponseFavoriteDto } from './dto/response-favorite.dto';
import { BadRequestExceptionFilter } from '../filters/bad-request-exception.filter';
import { NotFoundExceptionFilter } from '../filters/not-found-exception.filter';
import { UUIDValidationPipe } from '../validators/uuid-validation.pipe';
import { TransformInterceptor } from '../interceptors/transform.interceptor';

@UseFilters(BadRequestExceptionFilter, NotFoundExceptionFilter)
@UseInterceptors(new TransformInterceptor(ResponseFavoriteDto))
@Controller('favs')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Get()
  findAll(): ResponseFavoriteDto {
    return this.favoriteService.findAll();
  }

  @Post('track/:id')
  @HttpCode(HttpStatus.CREATED)
  createTrack(
    @Param('id', UUIDValidationPipe) id: string,
  ): ResponseFavoriteDto {
    return this.favoriteService.create(id, 'tracks');
  }

  @Post('album/:id')
  @HttpCode(HttpStatus.CREATED)
  createAlbum(
    @Param('id', UUIDValidationPipe) id: string,
  ): ResponseFavoriteDto {
    return this.favoriteService.create(id, 'albums');
  }

  @Post('artist/:id')
  @HttpCode(HttpStatus.CREATED)
  createArtist(
    @Param('id', UUIDValidationPipe) id: string,
  ): ResponseFavoriteDto {
    return this.favoriteService.create(id, 'artists');
  }

  // @Delete(':id')
  // @HttpCode(HttpStatus.NO_CONTENT)
  // remove(@Param('id', UUIDValidationPipe) id: string): boolean {
  //   return this.artistService.remove(id);
  // }
}
