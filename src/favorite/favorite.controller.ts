import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { ResponseFavoriteDto } from './dto/response-favorite.dto';
import { BadRequestExceptionFilter } from '../filters/bad-request-exception.filter';
import { NotFoundExceptionFilter } from '../filters/not-found-exception.filter';
import { UUIDValidationPipe } from '../validators/uuid-validation.pipe';
import { TransformInterceptor } from '../interceptors/transform.interceptor';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseFilters(BadRequestExceptionFilter, NotFoundExceptionFilter)
@UseInterceptors(new TransformInterceptor(ResponseFavoriteDto))
@Controller('favs')
@UseGuards(JwtAuthGuard) // Apply the JWTAuthGuard here
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

  @Delete('track/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeTrack(@Param('id', UUIDValidationPipe) id: string): void {
    return this.favoriteService.remove(id, 'tracks');
  }

  @Delete('album/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeAlbum(@Param('id', UUIDValidationPipe) id: string): void {
    return this.favoriteService.remove(id, 'albums');
  }

  @Delete('artist/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeArtist(@Param('id', UUIDValidationPipe) id: string): void {
    return this.favoriteService.remove(id, 'artists');
  }
}
