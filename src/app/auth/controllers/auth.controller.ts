import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  UseGuards,
  Version,
} from '@nestjs/common';
import { AuthService } from '../services';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { SignInDto, SignUpDto } from '../dtos';
import { ResponseEntity } from 'src/common/entities/response.entity';
import { AuthGuard } from '../guards';
import { User } from '../decorators';
import { users as Auth } from '@prisma/client';

@ApiTags('Auth')
@Controller({
  path: 'auth',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Version('1')
  async signIn(@Body() createAuthDto: SignInDto) {
    try {
      const data = await this.authService.signIn(createAuthDto);
      return new ResponseEntity({
        results: {
          data,
        },
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
  }

  @Post('register')
  @Version('1')
  async signUp(@Body() signUpDto: SignUpDto) {
    try {
      const data = await this.authService.signUp(signUpDto);
      return new ResponseEntity({
        results: {
          data,
        },
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
  }

  @ApiSecurity('JWT')
  @UseGuards(AuthGuard)
  @Get('profile')
  @Version('1')
  async profile(@User() user: Auth) {
    const data = await this.authService.profile(user);

    return new ResponseEntity({
      results: {
        data,
      },
    });
  }
}
