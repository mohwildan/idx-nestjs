import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { PaginatedEntity } from 'src/common/entities/paginated.entity';
import { PrismaService } from 'src/platform/database/services/prisma.service';

type Filter = {
  where?: Prisma.companiesWhereInput;
  orderBy?: Prisma.companiesOrderByWithRelationInput;
  cursor?: Prisma.companiesWhereUniqueInput;
  take?: number;
  skip?: number;
  include?: Prisma.companiesInclude;
};

@Injectable()
export class CompanyRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public async paginate(paginateDto: PaginationQueryDto, filter?: Filter) {
    const { limit = 10, page = 1 } = paginateDto;

    const [data, count] = await this.prismaService.$transaction([
      this.prismaService.companies.findMany({
        skip: (+page - 1) * +limit,
        take: +limit,
        ...filter,
      }),
      this.prismaService.companies.count(),
    ]);

    return new PaginatedEntity(data, {
      limit,
      page,
      totalData: count,
    });
  }

  public async create(data: Prisma.companiesCreateInput) {
    return this.prismaService.companies.create({ data });
  }

  public async update(
    where: Prisma.companiesWhereUniqueInput,
    data: Prisma.companiesUpdateInput,
  ) {
    return this.prismaService.companies.update({ where, data });
  }

  public async delete(where: Prisma.companiesWhereUniqueInput) {
    return this.prismaService.companies.update({
      where,
      data: { deletedAt: new Date() },
    });
  }

  public async first(
    where: Prisma.companiesWhereUniqueInput,
    select?: Prisma.companiesSelect,
  ) {
    return this.prismaService.companies.findUnique({ where, select });
  }

  public async firstOrThrow(
    where: Prisma.companiesWhereUniqueInput,
    select?: Prisma.companiesSelect,
  ) {
    const data = await this.prismaService.companies.findUnique({
      where,
      select,
    });
    if (!data) throw new Error('data.not_found');
    return data;
  }

  public async find(filter: Filter) {
    return this.prismaService.companies.findMany(filter);
  }

  public async count(filter: Omit<Filter, 'include'>) {
    return this.prismaService.companies.count(filter);
  }

  public async any(filter: Omit<Filter, 'include'>) {
    return (await this.prismaService.companies.count(filter)) > 0;
  }
}
