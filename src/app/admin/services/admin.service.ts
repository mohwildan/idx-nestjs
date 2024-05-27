import { Injectable } from '@nestjs/common';
import { AdminRepository } from '../repositories';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { CreateAdminDto, UpdateAdminDto } from '../dtos';

@Injectable()
export class AdminService {
  constructor(private readonly user_adminsRepository: AdminRepository) {}

  public paginate(paginateDto: PaginationQueryDto) {
    return this.user_adminsRepository.paginate(paginateDto);
  }

  public detail(id: string) {
    try {
      return this.user_adminsRepository.firstOrThrow({
        id,
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  public async destroy(id: string) {
    try {
      return this.user_adminsRepository.delete({
        id,
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  public async create(createAdminDto: CreateAdminDto) {
    try {
      return this.user_adminsRepository.create(createAdminDto);
    } catch (error) {
      throw new Error(error);
    }
  }

  public async update(id: string, updateAdminDto: UpdateAdminDto) {
    try {
      return this.user_adminsRepository.update({ id }, updateAdminDto);
    } catch (error) {
      throw new Error(error);
    }
  }
}
