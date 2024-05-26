import { Inject, Injectable } from '@nestjs/common';
import { UsersService } from 'src/app/users/services';
import { SignInDto } from '../dtos/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import { users } from '@prisma/client';
import { SignUpDto } from '../dtos';
import { TypedEventEmitter } from '../../../event-emitter/typed-event-emitter.class';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly eventEmitter: TypedEventEmitter,
    @Inject('NOTIFICATION_SERVICE') private client: ClientProxy,
  ) {}
  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async signIn(signInDto: SignInDto): Promise<{
    token: string;
    user: users;
  }> {
    this.client.emit('verify_email', signInDto);
    const user = await this.userService.login(signInDto);
    const token = this.jwtService.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      {
        secret: process.env.JWT_SECRET,
      },
    );
    delete user.password;
    this.eventEmitter.emit('user.verify-email', {
      name: user.name,
      email: user.email,
      otp: '****', // generate a random OTP
    });
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
    return {
      token,
      user,
    };
  }

  async profile(user: users): Promise<users> {
    return this.userService.detail(user.id);
  }
}
