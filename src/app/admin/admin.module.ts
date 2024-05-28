import { Module } from '@nestjs/common';
import { AdminController } from './controllers';
import { AdminService } from './services';
import { AdminRepository } from './repositories';

@Module({
  controllers: [AdminController],
  providers: [AdminService, AdminRepository],
  exports: [AdminService],
})
export class AdminModule {}
