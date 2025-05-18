import { IsString, IsDate, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAdministratorDto {
  @IsString()
  academicTitle: string;

  @IsString()
  trainingArea: string;

  @IsString()
  maritalStatus: string;

  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  endDate?: Date;

  @IsString()
  teachingLevel: string;

  @IsString()
  contractType: string;

  @IsString()
  @IsOptional()
  signature?: string;

  @IsNumber()
  administratorTypeId: number;

  @IsNumber()
  userId: number;

  @IsString()
  scalafon: string;

  @IsString()
  @IsOptional()
  appointmentResolution?: string;

  @IsNumber()
  status: boolean;

}