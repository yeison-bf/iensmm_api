import { IsNumber, IsNotEmpty, Min, Max, ValidateNested, IsArray, IsString, IsDate, IsOptional } from 'class-validator';
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

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  closeDate: Date;
}

export class CreatePeriodDto {
  @IsNumber()
  @IsNotEmpty()
  @Min(2000)
  @Max(2100)
  year: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Max(12)
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