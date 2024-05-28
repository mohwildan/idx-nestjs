import { IsObject, IsString, ValidateNested } from 'class-validator';
import { CreateCompanyDto } from 'src/app/company/dtos';
import { Type } from 'class-transformer';

class User {
  @IsString()
  name: string;

  @IsString()
  phone: string;

  @IsString()
  nik: string;

  @IsString()
  position: string;
}

export class CompleteDataDto {
  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => User)
  user: User;

  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => CreateCompanyDto)
  company: CreateCompanyDto;
}
