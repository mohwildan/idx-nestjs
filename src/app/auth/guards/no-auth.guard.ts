import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { AppLocalService } from '../../../common/app-local/app-local.service';

@Injectable()
export class NoAuthGuard implements CanActivate {
  constructor(private appLocalService: AppLocalService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    try {
    } catch {
      throw new BadRequestException();
    }
    return true;
  }
}
