import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Order } from '../../orders/entities/order.entity';

export enum ProviderTypes {
  COD = 'cod',
  STRIPE = 'stripe',
  RAZORPAY = 'razorpay',
}

export enum PaymentMethod {
  UPI = 'upi',
  CREDITCARD = 'credit_card',
  DEBITCARD = 'debit_card',
  NETBANKING = 'net_banking',
  CASH = 'cash',
  WALLET = 'wallet',
}

export enum PaymentStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Order, (order) => order.payment, { onDelete: 'CASCADE' })
  @JoinColumn()
  order: Order;

  @Column({
    type: 'decimal',
    nullable: false,
    precision: 10,
    scale: 2,
  })
  amount: number;

  @Column({
    type: 'enum',
    enum: ProviderTypes,
    nullable: false,
  })
  provider: ProviderTypes;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
    nullable: false,
  })
  paymentMethod: PaymentMethod;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
    nullable: false,
  })
  status: PaymentStatus;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  transactionId: string;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  paidAt: Date;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  failureReason: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
