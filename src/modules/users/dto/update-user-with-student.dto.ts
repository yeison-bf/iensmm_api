import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';
import { UpdateUserDto } from './update-user.dto';
import { CreateStudentInfoDto } from './create-user-with-student.dto';

export class UpdateUserWithStudentDto {
  @ValidateNested()
  @Type(() => UpdateUserDto)
  user: UpdateUserDto;

  @ValidateNested()
  @IsOptional()
  @Type(() => CreateStudentInfoDto)
  studentInfo?: CreateStudentInfoDto;
}