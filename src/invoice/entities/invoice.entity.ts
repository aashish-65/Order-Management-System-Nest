import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from '../../orders/entities/order.entity';

@Entity()
export class Invoice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  invoiceNumber: string;

  @OneToOne(() => Order, (order) => order.invoice, { onDelete: 'CASCADE' })
  @JoinColumn()
  order: Order;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subTotal: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  tax: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  shippingCharge: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  grandTotal: number;

  @CreateDateColumn()
  createdAt: Date;
}
