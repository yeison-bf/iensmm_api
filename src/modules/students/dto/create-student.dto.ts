import { IsDate, IsString, IsBoolean, IsOptional, IsNumber, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateStudentDto {
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  birthDate: Date;

  @IsString()
  @IsNotEmpty()
  bloodType: string;

  @IsString()
  @IsNotEmpty()
  birthDepartment: string;

  @IsString()
  @IsNotEmpty()
  birthCity: string;

  @IsString()
  @IsNotEmpty()
  population: string;

  @IsBoolean()
  disability: boolean;

  @IsString()
  @IsOptional()
  disabilityType?: string;

  @IsString()
  @IsNotEmpty()
  healthProvider: string;

  @IsString()
  @IsOptional()
  observations?: string;

  @IsNumber()
  @IsNotEmpty()
  userId: number;
}