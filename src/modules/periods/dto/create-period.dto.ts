import { IsNumber, IsNotEmpty, Min, Max, ValidateNested, IsArray, IsString, IsDate, IsOptional, IsDateString, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

class PeriodDetailDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  startDate: Date;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  endDate: Date;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsString()
  @IsNotEmpty()
  name: string;


  @IsOptional()
  closeDate: Date;

  
  @IsOptional()
  @IsDateString()
  startDateLeveling?: Date;

  @IsOptional()
  @IsDateString()
  endDateLeveling?: Date;

  @IsOptional()
  @IsBoolean()
  hasLeveling: boolean = false;

  @IsOptional()
  @IsBoolean()
  hasRecovery: boolean = false;

}

export class CreatePeriodDto {

  @IsOptional()
  id?: number; // ✅ Necesario para actualización

  @IsNumber()
  @IsNotEmpty()
  @Min(2000)
  @Max(2100)
  year: number;

  @IsOptional()
  @IsNumber()
  periodsQuantity: number;

  @IsNumber()
  @IsNotEmpty()
  institutionId: number;
  
  @IsString()
  @IsOptional()
  programId?:number

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PeriodDetailDto)
  periodDetails: PeriodDetailDto[];
}