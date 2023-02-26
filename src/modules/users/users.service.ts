import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.shema';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from './users.shema';

const scrypt = promisify(_scrypt);

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findOne(email: string): Promise<User | undefined> {
    return this.userModel.findOne({ email });
  }

  async create(email: string, password: string) {
    const userCheck = await this.userModel.findOne({ email });
    if (userCheck) {
      throw new ConflictException(email + ' are exist');
    }
    const salt = '1234';
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    const storePassword = salt + '.' + hash.toString('hex');

    const user = await this.userModel.create({
      email,
      password: storePassword,
    });

    return user;
  }
}
