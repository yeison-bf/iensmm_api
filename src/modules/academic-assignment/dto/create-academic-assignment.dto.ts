import { IsNumber, IsBoolean, IsOptional, IsDateString } from 'class-validator';

export class CreateAcademicAssignmentDto {
  @IsNumber()
  year: number;

  @IsNumber()
  headquartersId: number;

  @IsNumber()
  administratorId: number;

  @IsNumber()
  academicThinkingDetailId: number;

  @IsNumber()
  studentEnrollmentId: number;

  @IsBoolean()
  @IsOptional()
  status?: boolean;

  @IsDateString()
  @IsOptional()
  closingDate?: Date;
}