import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersRepository } from '../repositories';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { CreateUsersDto, UpdateUsersDto } from '../dtos';
import * as bcrypt from '@node-rs/bcrypt';
import { SignInDto, SignUpDto } from 'src/app/auth/dtos';
import { PrismaService } from '../../../platform/database/services/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UsersRepository,
    private prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  public paginate(paginateDto: PaginationQueryDto) {
    return this.userRepository.paginate(paginateDto);
  }

  public detail(id: string) {
    try {
      return this.userRepository.firstOrThrow({
        id,
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  public async destroy(id: string) {
    try {
      return this.userRepository.delete({
        id,
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  public async create(createUsersDto: CreateUsersDto) {
    try {
      return this.userRepository.create(createUsersDto);
    } catch (error) {
      throw new Error(error);
    }
  }

  public async update(id: string, updateUsersDto: UpdateUsersDto) {
    try {
      return this.userRepository.update({ id }, updateUsersDto);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  public async register(signUpDto: SignUpDto) {
    try {
      const hashPassword = await bcrypt.hash(signUpDto.password, 10);

      const emailExist = await this.prismaService.users.findFirst({
        where: {
          email: signUpDto.email,
        },
      });

      if (emailExist) {
        throw new HttpException(
          'email sudah tersedia!',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (signUpDto.password !== signUpDto.confirmPassword) {
        throw new HttpException(
          'password dan konfirm password tidak valid!',
          HttpStatus.BAD_REQUEST,
        );
      }
      const payload = {
        password: hashPassword,
        email: signUpDto.email,
      };
      return await this.prismaService.users.create({
        data: payload,
      });
    } catch (error) {
      throw new Error(error.message);
    }
  }

  public async login(signInDto: SignInDto) {
    try {
      const user = await this.prismaService.users.findFirst({
        where: {
          email: signInDto.email,
        },
      });
      if (!user) {
        throw new HttpException(
          'user tidak ditemukan!',
          HttpStatus.BAD_REQUEST,
        );
      }
      const match = await bcrypt.compare(signInDto.password, user.password);
      if (!match) {
        throw new HttpException(
          'email atau password tidak cocok!',
          HttpStatus.BAD_REQUEST,
        );
      }

      return user;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
