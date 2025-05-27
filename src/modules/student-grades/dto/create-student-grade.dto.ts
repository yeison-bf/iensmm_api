import { IsNumber, IsString, IsOptional, Min, Max, IsIn, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class GradeDto {
  @IsNumber()
  @Min(0)
  @Max(5)
  numericalGrade: number;

  @IsString()
  @IsIn(['Superior', 'Alto', 'Básico', 'Bajo'])
  qualitativeGrade: string;

  @IsNumber()
  @Min(0)
  @Max(5)
  disciplineGrade: number;

  @IsString()
  @IsOptional()
  observations?: string;

  @IsNumber()
  studentEnrollmentId: number;

  @IsNumber()
  academicThinkingDetailId: number;

  @IsNumber()
  periodDetailId: number;

  @IsNumber()
  teacherId: number;
}

export class CreateStudentGradeDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => GradeDto)
    grades: GradeDto[];
  }