import { IsString, IsDate, IsNotEmpty, Length, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePeriodDetailDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 20)
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
  @IsNotEmpty()
  closeDate: Date;

  @IsNumber()
  @IsNotEmpty()
  periodId: number;
}