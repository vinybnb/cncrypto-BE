import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async findOne(email: string): Promise<User | undefined> {
    return this.repo.findOne({ email });
  }

  async create(email: string, password: string) {
    const userCheck = await this.repo.findOne({ email });
    if (userCheck) {
      throw new ConflictException(email + ' are exist');
    }
    const salt = '1234';
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    const storePassword = salt + '.' + hash.toString('hex');

    const user = this.repo.create({ email, password: storePassword });

    await this.repo.save(user);
    return user;
  }
}
