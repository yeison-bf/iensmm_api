import { IsNumber, IsString, IsOptional, Min, Max, IsIn } from 'class-validator';

export class CreateStudentGradeDto {
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