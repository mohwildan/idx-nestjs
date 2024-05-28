import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AdminRepository } from '../repositories';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { CreateAdminDto, LoginAdminDto, UpdateAdminDto } from '../dtos';
import * as bcrypt from '@node-rs/bcrypt';

@Injectable()
export class AdminService {
  constructor(private readonly user_adminsRepository: AdminRepository) {}
  async login(loginAdminDto: LoginAdminDto) {
    const userAdmin = await this.user_adminsRepository.first({
      email: loginAdminDto.email,
    });
    if (!userAdmin) {
      throw new HttpException('user tidak ditemukan!', HttpStatus.BAD_REQUEST);
    }
    const match = await bcrypt.compare(
      loginAdminDto.password,
      userAdmin.password,
    );
    if (!match) {
      throw new HttpException(
        'email atau password tidak cocok!',
        HttpStatus.BAD_REQUEST,
      );
    }
    return userAdmin;
  }
}
