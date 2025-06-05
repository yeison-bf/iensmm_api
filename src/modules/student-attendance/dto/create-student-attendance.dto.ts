import { IsDate, IsString, IsBoolean, IsOptional, IsNumber, IsNotEmpty, IsArray, ValidateNested, IsDateString } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateStudentAttendanceDto {
   // Cambiar para aceptar string de fecha en formato ISO
   @IsDateString()
   @IsNotEmpty()
   @Transform(({ value }) => {
     // Si viene como string, convertir a Date
     if (typeof value === 'string') {
       return new Date(value);
     }
     return value;
   })
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