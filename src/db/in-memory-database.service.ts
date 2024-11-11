import { Injectable } from '@nestjs/common';
import { v4 } from 'uuid';
import {
  Favorite,
  FavoriteType,
} from '../favorite/interfaces/favorite.interface';

@Injectable()
export class InMemoryDatabaseService<T> {
  private items: T[] = [];
  private favorites: Favorite = {
    artists: [],
    albums: [],
    tracks: [],
  };

  create(item: T): T {
    this.items.push(item);
    return item;
  }

  findAll(): T[] {
    return this.items;
  }

  findOne(id: string): T | undefined {
    return this.items.find((item) => item['id'] === id);
  }

  update(id: string, updatedItem: T): T | undefined {
    const index = this.items.findIndex((item) => item['id'] === id);
    if (index === -1) return undefined;
    this.items[index] = { ...this.items[index], ...updatedItem };
    return this.items[index];
  }

  remove(id: string): boolean {
    const index = this.items.findIndex((item) => item['id'] === id);
    if (index === -1) return false;
    this.items.splice(index, 1);
    return true;
  }

  createFavorite(favoriteId: string, favoriteType: FavoriteType): Favorite {
    this.favorites[favoriteType].push(favoriteId);
    return this.favorites;
  }

  getAllFavorite(): Favorite {
    return this.favorites;
  }
}
