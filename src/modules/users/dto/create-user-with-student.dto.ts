import { Type } from 'class-transformer';
import { IsDate, IsString, IsBoolean, IsOptional, ValidateNested, IsNumber } from 'class-validator';
import { CreateUserDto } from './create-user.dto';


export class CreateStudentInfoDto {
  @Type(() => Date)
  @IsDate()
  birthDate: Date;

  @IsString()
  bloodType: string;

  @IsString()
  birthDepartment: string;

  @IsString()
  birthCity: string;

  @IsString()
  population: string;

  @IsBoolean()
  disability: boolean;

  @IsString()
  @IsOptional()
  disabilityType?: string;

  @IsString()
  healthProvider: string;

  @IsString()
  @IsOptional()
  observations?: string;

  @IsString()
  @IsOptional()
  expeditionDepartment?: string;

  @IsString()
  @IsOptional()
  expeditionCity?: string;

  @IsString()
  @IsOptional()
  zone?: string;

  @IsNumber()
  @IsOptional()
  stratum?: number;

  @IsBoolean()
  @IsOptional()
  sisben?: boolean;

  @IsString()
  @IsOptional()
  sisbenScore?: string;

  @IsBoolean()
  @IsOptional()
  armedConflictVictim?: boolean;
}


export class CreateUserWithStudentDto {
  @ValidateNested()
  @Type(() => CreateUserDto)
  user: CreateUserDto;

  @ValidateNested()
  @Type(() => CreateStudentInfoDto)
  studentInfo: CreateStudentInfoDto;
}