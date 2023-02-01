import {
  Entity,
  PrimaryGeneratedColumn,
  ObjectIdColumn,
  AfterInsert,
  AfterUpdate,
  AfterRemove,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';

import { STATUS, CHAIN } from './coin.enum';
import { PromotedList } from './promoted-list.entity';

@Entity()
export class Coin {
  @ObjectIdColumn()
  id: string;

  @Column({
    length: 100,
  })
  name: string;

  @Column({
    length: 100,
  })
  slug: string;

  @Column({
    length: 100,
  })
  symbol: string;

  @Column({
    length: 256,
  })
  logo: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  desc_cn: string;

  @Column()
  chain: CHAIN;

  @Column({ name: 'contract_address' })
  contractAddress: string;

  @Column({ name: 'whitelist_link', nullable: true })
  whitelistLink: string;

  @Column({ name: 'presale_link', nullable: true })
  presaleLink: string;

  @Column({ name: 'presale_platform', nullable: true })
  presalePlatform: string;

  @Column({ name: 'presale_time', nullable: true })
  presaleTime?: Date;

  @Column({ name: 'launch_time' })
  launchTime!: Date;

  @Column({ name: 'launch_platform', nullable: true })
  launchPlatform: string;

  @Column({ name: 'launch_link', nullable: true })
  launchLink: string;

  @Column({ length: 50, name: 'contact_email', nullable: true })
  contactEmail: string;

  @Column({ length: 50, name: 'contact_telegram', nullable: true })
  contactTelegram: string;

  @Column({ nullable: true })
  kyc: string;

  @Column({ name: 'approved_kyc', default: false })
  approvedKyc: boolean = false;

  @Column({ nullable: true })
  audit: string;

  @Column({ name: 'approved_audit', default: false })
  approvedAudit: boolean = false;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'approved_at' })
  approvedAt: string;

  @Column({ name: 'total_votes', default: 0 })
  totalVotes: number = 0;

  @Column({ length: 50 })
  website: string;

  @Column({ length: 50, nullable: true })
  discord: string;

  @Column({ length: 50 })
  telegram: string;

  @Column({ length: 50 })
  twitter: string;

  @Column({ length: 50, nullable: true })
  telegram_cn: string;

  @Column({ length: 50, nullable: true })
  btok: string;

  @Column({
    type: 'enum',
    enum: STATUS,
    default: STATUS.APPROVING,
  })
  status: STATUS = STATUS.APPROVING;

  @OneToOne(() => PromotedList, (promotedList) => promotedList.coin)
  promotedCoin: PromotedList;

  @AfterInsert()
  logInsert() {
    console.log('Inserted Coin with Id', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('Updated Coin with id', this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log('Removed Coin ith Id', this.id);
  }
}
