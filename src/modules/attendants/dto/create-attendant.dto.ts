import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateAttendantDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  relationship: string;

  @IsString()
  @IsNotEmpty()
  document: string;

  @IsString()
  @IsNotEmpty()
  documentType: string;

  @IsString()
  @IsOptional()
  phone: string;

  @IsOptional()
  @IsEmail(undefined, { message: 'Invalid email format' })
  email: string | null;

  @IsString()
  @IsOptional()
  address: string;

  @IsNumber()
  @IsNotEmpty()
  studentId: number;
}