import { IsNumber, IsString, IsOptional, Min, Max, IsIn, IsArray, ValidateNested, IsDate, IsBoolean, IsDateString } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class UpdateGradeDto {
  @IsNumber()
  id: number;

  @IsNumber()
  @Min(0)
  @Max(5)
  @IsOptional()
  numericalGrade?: number;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  @IsOptional()
  degreeId?: number;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  @IsOptional()
  groupId?: number;

  @IsString()
  @IsOptional()
  qualitativeGrade?: string;

  @IsNumber()
  @Min(0)
  @Max(5)
  @IsOptional()
  disciplineGrade?: number;

  @IsString()
  @IsOptional()
  observations?: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (!value || value === '') return null;
    return new Date(value);
  })
  closingDate?: Date;

  @IsBoolean()
  @IsOptional()
  status?: boolean;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  @IsOptional()
  studentEnrollmentId?: number;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  @IsOptional()
  academicThinkingDetailId?: number;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  @IsOptional()
  periodDetailId?: number;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  @IsOptional()
  teacherId?: number;
}

export class UpdateStudentGradesBulkDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateGradeDto)
  grades: UpdateGradeDto[];
}
