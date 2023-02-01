import {
  Entity,
  PrimaryGeneratedColumn,
  ObjectIdColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ROLE } from '../enums/role.enum';

@Entity()
export class User {
  @ObjectIdColumn()
  id: string;

  @Column({
    length: 100,
  })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: ROLE,
    default: ROLE.MEMBER,
  })
  role: ROLE = ROLE.MEMBER;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
