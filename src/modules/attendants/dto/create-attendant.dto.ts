import { IsNotEmpty, IsString, IsNumber, IsEmail, IsOptional } from 'class-validator';

export class CreateAttendantDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  document: string;

  @IsString()
  @IsNotEmpty()
  documentType: string;

  @IsString()
  @IsNotEmpty()
  relationship: string;

  @IsString()
  @IsNotEmpty()
  occupation: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsNumber()
  @IsNotEmpty()
  studentId: number;
}