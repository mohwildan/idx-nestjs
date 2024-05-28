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
} from '@nestjs/common';
import { AdminService } from '../services';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { ResponseEntity } from 'src/common/entities/response.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Admin')
@Controller({
  path: 'user_admins',
  version: '1',
})
export class AdminController {
  constructor(private readonly user_adminsService: AdminService) {}
}
