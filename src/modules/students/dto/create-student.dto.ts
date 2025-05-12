import { IsDate, IsString, IsBoolean, IsOptional, IsNumber, IsNotEmpty, Min, Max, MaxLength } from 'class-validator';
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


  @IsOptional()
  @IsString()
  @MaxLength(100)
  expeditionDepartment?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  expeditionCity?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  zone?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(6)
  stratum?: number;

  @IsOptional()
  @IsBoolean()
  sisben?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  sisbenScore?: number;

  @IsOptional()
  @IsBoolean()
  armedConflictVictim?: boolean;


  @IsString()
  @IsOptional()
  observations?: string;

  @IsNumber()
  @IsNotEmpty()
  userId: number;
}