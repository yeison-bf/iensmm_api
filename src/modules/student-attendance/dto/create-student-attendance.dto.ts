import { IsDate, IsString, IsBoolean, IsOptional, IsNumber, IsNotEmpty, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateStudentAttendanceDto {
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  date: Date;

  @IsBoolean()
  attended: boolean;

  @IsString()
  @IsOptional()
  observations?: string;

  @IsNumber()
  @IsNotEmpty()
  studentId: number;

  @IsNumber()
  @IsNotEmpty()
  trainingAreaId: number;

  @IsNumber()
  @IsNotEmpty()
  administratorId: number;

  @IsNumber()
  @IsNotEmpty()
  degreeId: number;

  @IsNumber()
  @IsNotEmpty()
  groupId: number;
}

// DTO para el array de asistencias
export class CreateManyStudentAttendancesDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateStudentAttendanceDto)
  attendances: CreateStudentAttendanceDto[];
}