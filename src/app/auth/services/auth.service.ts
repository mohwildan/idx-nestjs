import { HttpException, Inject, Injectable } from '@nestjs/common';
import { UsersService } from 'src/app/users/services';
import { SignInDto } from '../dtos/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import { users } from '@prisma/client';
import { ClientProxy } from '@nestjs/microservices';
import { AppLocalService } from 'src/common/app-local/app-local.service';
import { LoginAdminDto } from 'src/app/admin/dtos';
import { AdminService } from 'src/app/admin/services';
import { CompanyService } from 'src/app/company/services';
import { CompleteDataDto, SignUpDto } from '../dtos';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly userAdminService: AdminService,
    private readonly jwtService: JwtService,
    private readonly appLocalService: AppLocalService,
    private readonly companyService: CompanyService,
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
  async loginAdmin(loginAdminDto: LoginAdminDto) {
    const userAdmin = await this.userAdminService.login(loginAdminDto);
    const token = this.jwtService.sign(
      {
        id: userAdmin.id,
        email: userAdmin.email,
        name: userAdmin.name,
        role: 'admin',
      },
      {
        secret: process.env.JWT_SECRET,
      },
    );
    delete userAdmin.password;
    return {
      token,
      user: userAdmin,
    };
  }
  async completeData(completeDataDto: CompleteDataDto) {
    try {
      const user = this.appLocalService.getData<{ id: string }>('user');
      const company = await this.companyService.create(completeDataDto.company);
      const userUpdate = await this.userService.update(user.id, {
        company_id: company.id,
        phone: completeDataDto.user.phone,
        nik: completeDataDto.user.nik,
        position: completeDataDto.user.position,
      });
      return {
        user: userUpdate,
        company,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async profile() {
    return this.appLocalService.getData('user');
  }
}
