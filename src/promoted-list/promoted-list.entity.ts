import {
  Entity,
  PrimaryGeneratedColumn,
  ObjectIdColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Coin } from '../coins/coin.entity';

@Entity()
export class PromotedList {
  @ObjectIdColumn()
  id: string;

  @Column({ name: 'start_time' })
  startTime: Date;

  @Column({ name: 'expired_time' })
  expiredTime: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // @Column()
  @ObjectIdColumn()
  coinId: string;

  @OneToOne(() => Coin, (coin) => coin.promotedCoin, { onDelete: 'CASCADE' })
  @JoinColumn()
  coin: Coin;
}
