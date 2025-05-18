import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested, IsString, IsDate, IsNumber, IsOptional, IsBoolean } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class CreateAdministratorInfoDto {
  @IsString()
  @IsNotEmpty()
  academicTitle: string;

  @IsString()
  @IsNotEmpty()
  trainingArea: string;

  @IsString()
  @IsNotEmpty()
  maritalStatus: string;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  startDate: Date;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  endDate?: Date;

  @IsString()
  @IsNotEmpty()
  teachingLevel: string;

  @IsString()
  @IsNotEmpty()
  contractType: string;

  @IsString()
  @IsOptional()
  signature?: string;

  @IsNumber()
  @IsNotEmpty()
  administratorTypeId: number;

  @IsString()
  scalafon: string;

  @IsString()
  @IsOptional()
  appointmentResolution?: string;

  @IsBoolean()
  @IsNotEmpty()
  status: boolean;

}

export class CreateUserWithAdministratorDto {
  @ValidateNested()
  @Type(() => CreateUserDto)
  user: CreateUserDto;

  @ValidateNested()
  @Type(() => CreateAdministratorInfoDto)
  administratorInfo: CreateAdministratorInfoDto;
}