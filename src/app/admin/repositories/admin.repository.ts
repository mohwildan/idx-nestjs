import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { PaginatedEntity } from 'src/common/entities/paginated.entity';
import { PrismaService } from 'src/platform/database/services/prisma.service';

type Filter = {
  where?: Prisma.user_adminsWhereInput;
  orderBy?: Prisma.user_adminsOrderByWithRelationInput;
  cursor?: Prisma.user_adminsWhereUniqueInput;
  take?: number;
  skip?: number;
  include?: Prisma.user_adminsInclude;
};

@Injectable()
export class AdminRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public async paginate(paginateDto: PaginationQueryDto, filter?: Filter) {
    const { limit = 10, page = 1 } = paginateDto;

    const [data, count] = await this.prismaService.$transaction([
      this.prismaService.user_admins.findMany({
        skip: (+page - 1) * +limit,
        take: +limit,
        ...filter,
      }),
      this.prismaService.user_admins.count(),
    ]);

    return new PaginatedEntity(data, {
      limit,
      page,
      totalData: count,
    });
  }

  public async create(data: Prisma.user_adminsCreateInput) {
    return this.prismaService.user_admins.create({ data });
  }

  public async update(
    where: Prisma.user_adminsWhereUniqueInput,
    data: Prisma.user_adminsUpdateInput,
  ) {
    return this.prismaService.user_admins.update({ where, data });
  }

  public async delete(
    where: Prisma.user_adminsWhereUniqueInput,
  ) {
    return this.prismaService.user_admins.update({
      where,
      data: { deletedAt: new Date() },
    });
  }

  public async first(
    where: Prisma.user_adminsWhereUniqueInput,
    select?: Prisma.user_adminsSelect,
  ) {
    return this.prismaService.user_admins.findUnique({ where, select });
  }

  public async firstOrThrow(
    where: Prisma.user_adminsWhereUniqueInput,
    select?: Prisma.user_adminsSelect,
  ) {
    const data = await this.prismaService.user_admins.findUnique({ where, select });
    if(!data) throw new Error('data.not_found');
    return data;
  }

  public async find(filter: Filter) {
    return this.prismaService.user_admins.findMany(filter);
  }

  public async count(filter: Omit<Filter, 'include'>) {
    return this.prismaService.user_admins.count(filter);
  }

  public async any(filter: Omit<Filter, 'include'>) {
    return (await this.prismaService.user_admins.count(filter)) > 0;
  }
}
