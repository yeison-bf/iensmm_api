import { IsString, IsDate, IsNotEmpty, Length, IsNumber, IsOptional, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePeriodDetailDto {
  @IsOptional()
  id?: number; // ✅ Necesario para actualización

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

  @IsNumber()
  @IsOptional()
  periodId: number;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startDateLeveling?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDateLeveling?: Date;

  @IsOptional()
  @IsBoolean()
  hasRecovery: boolean = false; // Valor por defecto: false

  @IsOptional()
  @IsBoolean()
  hasLeveling: boolean = false; // Valor por defecto: false

  @IsOptional()
  @IsBoolean()
  habilited: boolean = false; // Valor por defecto: false


  @IsOptional()
  @IsBoolean()
  statushasLeveling: boolean = false; // Valor por defecto: false


}
