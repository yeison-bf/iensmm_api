import { IsNumber, IsArray, ValidateNested, IsNotEmpty, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAcademicThinkingDetailDto {
  @IsNumber()
  @IsNotEmpty()
  hourlyIntensity: number;

  @IsNumber()
  @IsNotEmpty()
  percentage: number;

  @IsNumber()
  @IsNotEmpty()
  academicPensumId: number;

  @IsNumber()
  @IsNotEmpty()
  trainingAreaId: number;
}

export class CreateAcademicThinkingDto {
  @IsNumber()
  @IsNotEmpty()
  year: number;

  @IsNumber()
  @IsOptional()
  headquarterId?: number;

  @IsNumber()
  @IsOptional()
  directorGroupId?: number;

  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  additionalHeadquarters?: number[];

  @IsNumber()
  @IsNotEmpty()
  gradeId: number;
  
  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })
  additionalGrades?: number[];

  @IsNumber()
  @IsOptional()
  programId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAcademicThinkingDetailDto)
  details: CreateAcademicThinkingDetailDto[];
}