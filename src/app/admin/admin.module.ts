import { Module } from '@nestjs/common';
import { AdminController } from './controllers';
import { AdminService } from './services';
import { AdminRepository } from './repositories';

@Module({
  controllers: [AdminController],
  providers: [AdminService, AdminRepository],
})
export class AdminModule {}
