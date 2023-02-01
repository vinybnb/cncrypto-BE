import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { LoginDto } from './dtos/login.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get()
  getUser() {
    return 'user';
  }

  // @Post('/signup')
  // createUser(@Body() body: CreateUserDto) {
  //   return this.authService.signUp(body.email, body.password);
  // }

  // @Post('/signin')
  // login(@Body() body: LoginDto) {
  //   return this.authService.signIn(body.email, body.password);
  // }
}
