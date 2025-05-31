import { IsNumber, IsString, IsOptional, Min, Max, IsIn, IsArray, ValidateNested, IsDate, IsBoolean } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class GradeDto {

  
  @IsNumber()
  @Min(0)
  @Max(5)
  numericalGrade: number;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  degreeId: number;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  groupId: number;

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

  @IsDate()
  @IsOptional()
  closingDate:Date

  @IsBoolean()
  @IsOptional()
  status:boolean

  @IsNumber()
  @Transform(({ value }) => Number(value))
  studentEnrollmentId: number;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  academicThinkingDetailId: number;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  periodDetailId: number;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  teacherId: number;
}

export class CreateStudentGradeDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GradeDto)
  grades: GradeDto[];
}