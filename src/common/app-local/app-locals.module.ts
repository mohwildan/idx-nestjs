import { Global, Module } from '@nestjs/common';
import { AppLocals } from './index';
import { AppLocalService } from './app-local.service';

@Global()
@Module({
  providers: [AppLocals, AppLocalService],
  exports: [AppLocalService],
})
export class AppLocalsModule {}
