import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  login: string;

  @Column()
  password: string;

  @Column({ default: 0 })
  version: number;

  @Column('bigint')
  createdAt: number;

  @Column('bigint')
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
