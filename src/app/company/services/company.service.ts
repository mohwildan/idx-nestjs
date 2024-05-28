import { Injectable } from '@nestjs/common';
import { CompanyRepository } from '../repositories';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { CreateCompanyDto, UpdateCompanyDto } from '../dtos';

@Injectable()
export class CompanyService {
  constructor(private readonly companiesRepository: CompanyRepository) {}

  public paginate(paginateDto: PaginationQueryDto) {
    return this.companiesRepository.paginate(paginateDto, {
      include: {
        province: true,
        village: true,
        regency: true,
        district: true,
      },
    });
  }

  public detail(id: string) {
    try {
      return this.companiesRepository.firstOrThrow({
        id,
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  public async destroy(id: string) {
    try {
      return this.companiesRepository.delete({
        id,
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  public async create(createCompanyDto: CreateCompanyDto) {
    try {
      const payload = {
        name: createCompanyDto.name,
        address: createCompanyDto.address,
        postal_code: createCompanyDto.postal_code,
        npw: createCompanyDto.npw,
        kbli: createCompanyDto.kbli,
        kadin_membership_number: createCompanyDto.kadin_membership_number,
        membership_expiry_date: createCompanyDto.membership_expiry_date,
        district_code: createCompanyDto.districtCode,
        province_code: createCompanyDto.provinceCode,
        regency_code: createCompanyDto.regencyCode,
        village_code: createCompanyDto.villageCode,
      };
      return this.companiesRepository.create(payload);
    } catch (error) {
      throw new Error(error);
    }
  }

  public async update(id: string, updateCompanyDto: UpdateCompanyDto) {
    try {
      return this.companiesRepository.update({ id }, updateCompanyDto);
    } catch (error) {
      throw new Error(error);
    }
  }
}
