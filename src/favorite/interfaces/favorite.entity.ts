import { Entity, Column, BaseEntity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Favorite extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { array: true, default: [] })
  artists: string[];

  @Column('text', { array: true, default: [] })
  albums: string[];

  @Column('text', { array: true, default: [] })
  tracks: string[];
}
