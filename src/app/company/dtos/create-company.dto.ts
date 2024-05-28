import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsISO8601 } from 'class-validator';

export class CreateCompanyDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  address: string;

  @ApiProperty()
  @IsString()
  provinceCode: string;

  @ApiProperty()
  @IsString()
  regencyCode: string;

  @ApiProperty()
  @IsString()
  districtCode: string;

  @ApiProperty()
  @IsString()
  villageCode: string;

  @ApiProperty()
  @IsString()
  npw: string;

  @ApiProperty()
  @IsString()
  kbli: string;

  @ApiProperty()
  @IsString()
  postal_code: string;

  @ApiProperty()
  @IsString()
  kadin_membership_number: string;

  @ApiProperty()
  @IsISO8601()
  membership_expiry_date: Date;
}
