import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class SignUpDto {
  @ApiProperty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsString()
  @Length(6)
  password: string;

  @ApiProperty()
  @IsString()
  @Length(6)
  confirmPassword: string;
}
