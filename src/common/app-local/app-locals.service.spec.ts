import { Test, TestingModule } from '@nestjs/testing';
import { AppLocalService } from './app-local.service';

describe('AppLocalsService', () => {
  let service: AppLocalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppLocalService],
    }).compile();

    service = module.get<AppLocalService>(AppLocalService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
