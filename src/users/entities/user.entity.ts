import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Order } from '../../orders/entities/order.entity';
import { ProfileImage } from './profile-image.entity';

export enum GenderTypes {
  MALE = 'male',
  FEMALE = 'female',
  OTHERS = 'others',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  firstName: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  lastName: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 24,
    nullable: false,
    select: false,
  })
  password: string;

  @Column({
    type: 'enum',
    enum: GenderTypes,
    nullable: false,
  })
  gender: GenderTypes;

  @Column({
    type: 'datetime',
    nullable: false,
  })
  dateOfBirth: Date;

  @OneToOne(() => ProfileImage, (profileImage) => profileImage.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  profileImage: ProfileImage;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
