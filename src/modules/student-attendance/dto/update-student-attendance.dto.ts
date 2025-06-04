import { IsNumber, IsDate, IsBoolean, IsOptional, IsString, IsArray, ValidateNested, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateStudentAttendanceDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  date?: Date;

  @IsBoolean()
  @IsOptional()
  attended?: boolean;

  @IsString()
  @IsOptional()
  observations?: string;

  @IsNumber()
  @IsOptional()
  studentId?: number;

  @IsNumber()
  @IsOptional()
  trainingAreaId?: number;

  @IsNumber()
  @IsOptional()
  administratorId?: number;

  @IsNumber()
  @IsOptional()
  degreeId?: number;

  @IsNumber()
  @IsOptional()
  groupId?: number;
}

// DTO para el array de actualizaciones
export class UpdateManyStudentAttendancesDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateStudentAttendanceDto)
  attendances: UpdateStudentAttendanceDto[];
}