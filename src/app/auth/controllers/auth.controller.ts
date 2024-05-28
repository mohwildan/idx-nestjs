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
import { RoleAllowed } from 'src/common/guards/role-decorator';
import { UserRoles } from 'src/common/enums/role';
import { LoginAdminDto } from 'src/app/admin/dtos';
import { CompleteDataDto } from '../dtos';

@ApiTags('Auth')
@Controller({
  path: 'auth',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('company/login')
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

  @Post('company/register')
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

  @Post('admin/login')
  @Version('1')
  async adminLogin(@Body() loginAdminDto: LoginAdminDto) {
    try {
      const data = await this.authService.loginAdmin(loginAdminDto);
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
  @RoleAllowed(UserRoles['USER'], UserRoles['ADMIN'])
  @Version('1')
  async profile() {
    const data = await this.authService.profile();

    return new ResponseEntity({
      results: {
        data,
      },
    });
  }

  @ApiSecurity('JWT')
  @UseGuards(AuthGuard)
  @Post('company/complete-data')
  @RoleAllowed(UserRoles['USER'])
  @Version('1')
  async completeData(@Body() completeDataDto: CompleteDataDto) {
    const data = await this.authService.completeData(completeDataDto);

    return new ResponseEntity({
      results: {
        data,
      },
    });
  }
}
