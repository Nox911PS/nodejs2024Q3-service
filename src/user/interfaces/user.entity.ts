import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { NumberTransformer } from '../../shared/helpers/number-transformer';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  login: string;

  @Column()
  password: string;

  @Column({ default: 0 })
  version: number;

  @Column('bigint', { transformer: new NumberTransformer() })
  createdAt: number;

  @Column('bigint', { transformer: new NumberTransformer() })
  updatedAt: number;

  @BeforeInsert()
  private setCreatedAt() {
    const now = Date.now();
    this.createdAt = now;
    this.updatedAt = now;
  }

  @BeforeUpdate()
  private setUpdatedAt() {
    this.updatedAt = Date.now();
  }
}
