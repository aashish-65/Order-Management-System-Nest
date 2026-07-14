import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class ProfileImage {
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

  @OneToOne(() => User, (user) => user.profileImage, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
