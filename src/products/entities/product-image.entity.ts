import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class ProductImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'longblob',
    nullable: false,
  })
  data: Buffer;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  filename: string;

  @Column({
    type: 'varchar',
    length: 10,
    nullable: false,
  })
  encoding: string;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: false,
  })
  mimetype: string;

  @Column({
    type: 'int',
    nullable: false,
  })
  size: number;

  @ManyToOne(() => Product, (product) => product.images, {
    onDelete: 'CASCADE',
  })
  product: Product;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
