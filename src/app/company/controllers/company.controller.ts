import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  Version,
} from '@nestjs/common';
import { CompanyService } from '../services';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { ResponseEntity } from 'src/common/entities/response.entity';
import { CreateCompanyDto, UpdateCompanyDto } from '../dtos';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/app/auth';
import { UserRoles } from 'src/common/enums/role';
import { RoleAllowed } from 'src/common/guards/role-decorator';

@ApiTags('Company')
@Controller({
  path: 'company',
})
export class CompanyController {
  constructor(private readonly companiesService: CompanyService) {}

  @Post()
  public async create(@Body() createCompanyDto: CreateCompanyDto) {
    try {
      const data = await this.companiesService.create(createCompanyDto);
      return new ResponseEntity({
        results: {
          data,
        },
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @ApiSecurity('JWT')
  @Get('list')
  @RoleAllowed(UserRoles['ADMIN'])
  @Version('1')
  @Get()
  public async index(@Query() paginateDto: PaginationQueryDto) {
    try {
      const pagination = await this.companiesService.paginate(paginateDto);
      return new ResponseEntity({
        results: pagination,
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Get(':id')
  public async detail(@Param('id') id: string) {
    try {
      const data = await this.companiesService.detail(id);

      return new ResponseEntity({
        results: {
          data,
        },
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Delete(':id')
  public async destroy(@Param('id') id: string) {
    try {
      const data = await this.companiesService.destroy(id);
      return new ResponseEntity({
        results: {
          data,
        },
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Put(':id')
  public async update(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ) {
    try {
      const data = await this.companiesService.update(id, updateCompanyDto);
      return new ResponseEntity({
        results: {
          data,
        },
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
