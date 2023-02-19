import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { UsersService } from '../users/users.service';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(email);

    if (!user) {
      return null;
      //   throw new UnauthorizedException('Credentials incorrect!');
    }

    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    if (storedHash !== hash.toString('hex')) {
      return null;
      //   throw new UnauthorizedException('Credentials incorrect!');
    }

    return user;
  }

  async login(user: any) {
    delete user.password;
    return {
      access_token: this.jwtService.sign({ user }),
      user,
    };
  }

  async signUp(email: string, password: string) {
    const user = await this.usersService.create(email, password);
    return user;
  }
}
