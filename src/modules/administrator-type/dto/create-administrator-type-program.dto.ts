import { IsNumber, IsDate, IsBoolean, IsOptional } from 'class-validator';

export class CreateAdministratorTypeProgramDto {
  @IsNumber()
  administratorId: number;

  @IsNumber()
  administratorTypeId: number;

  @IsNumber()
  programId: number;

  @IsDate()
  startDate: Date;

  @IsDate()
  @IsOptional()
  endDate?: Date;

  @IsBoolean()
  @IsOptional()
  status?: boolean;
}