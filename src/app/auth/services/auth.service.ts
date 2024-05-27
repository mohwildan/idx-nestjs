import { Inject, Injectable } from '@nestjs/common';
import { UsersService } from 'src/app/users/services';
import { SignInDto } from '../dtos/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import { users } from '@prisma/client';
import { SignUpDto } from '../dtos';
import { ClientProxy } from '@nestjs/microservices';
import { AppLocalService } from 'src/common/app-local/app-local.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly appLocalService: AppLocalService,
    @Inject('NOTIFICATION_SERVICE') private client: ClientProxy,
  ) {}

  async signIn(signInDto: SignInDto): Promise<{
    token: string;
    user: users;
  }> {
    const user = await this.userService.login(signInDto);
    const token = this.jwtService.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        role: 'user',
      },
      {
        secret: process.env.JWT_SECRET,
      },
    );
    delete user.password;
    return {
      token,
      user,
    };
  }

  async signUp(signUpDto: SignUpDto) {
    const user = await this.userService.register(signUpDto);
    const token = this.jwtService.sign({
      email: user.email,
      id: user.id,
      name: user.name,
    });
    this.client.emit('verify_email', {
      name: user.name,
      email: user.email,
      link: 'http://localhost:3000',
    });
    return {
      token,
      user,
    };
  }

  async profile() {
    return this.appLocalService.getData('user');
  }
}
