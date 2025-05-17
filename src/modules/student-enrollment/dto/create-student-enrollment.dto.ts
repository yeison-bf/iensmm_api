import { IsString, IsDate, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateStudentEnrollmentDto {
  @IsString()
  schedule: string;

  @IsString()
  folio: string;

  @Type(() => Date)
  @IsDate()
  registrationDate: Date;

  @IsString()
  type: string;

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
  @IsOptional()
  institutionId?: number;
}