import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AppLocalService } from 'src/common/app-local/app-local.service';
import { UserRoles } from 'src/common/enums/role';
import { PrismaService } from 'src/platform/database/services/prisma.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private appLocalService: AppLocalService,
    private prismaService: PrismaService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if (context.getType() !== 'http') {
      false;
    }
    const roles =
      this.reflector.getAllAndMerge<UserRoles[]>('roles', [
        context.getClass(),
        context.getHandler(),
      ]) || [];

    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      let user;
      if (!roles.includes(payload.role)) {
        throw new HttpException(
          'Anda tidak berhak mengakses resource ini',
          HttpStatus.BAD_REQUEST,
        );
      }
      if (payload.role === UserRoles.USER) {
        user = await this.prismaService.users.findFirst({
          where: { id: payload.id },
        });
      }
      if (payload.role === UserRoles.ADMIN) {
        user = await this.prismaService.user_admins.findFirst({
          where: {
            id: payload.id,
          },
        });
      }

      if (!user) {
        throw new UnauthorizedException();
      }
      this.appLocalService.setData('user', user);
    } catch (error) {
      throw new HttpException(error.response, error.code);
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
