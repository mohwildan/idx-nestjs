import { Module } from '@nestjs/common';
import { CompanyController } from './controllers';
import { CompanyService } from './services';
import { CompanyRepository } from './repositories';

@Module({
  controllers: [CompanyController],
  providers: [CompanyService, CompanyRepository],
  exports: [CompanyService],
})
export class CompanyModule {}
