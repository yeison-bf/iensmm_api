import { IsString, IsNumber, IsBoolean, IsOptional, IsDateString } from 'class-validator';

export class CreateStudentEnrollmentDto {
  @IsString()
  schedule: string;

  @IsString()
  folio: string;

  @IsDateString()
  registrationDate: Date;

  @IsString()
  type: string;

  @IsBoolean()
  @IsOptional()
  status?: boolean;

  @IsString()
  @IsOptional()
  observations?: string;

  @IsNumber()
  groupId: number;

  @IsNumber()
  degreeId: number;

  @IsNumber()
  studentId: number;

  @IsNumber()
  headquarterId: number;

  @IsNumber()
  institutionId: number;

  @IsNumber()
  @IsOptional()
  programId?: number;
}