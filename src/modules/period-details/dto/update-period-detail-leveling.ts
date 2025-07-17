import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsDateString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class UpdatePerioDetailLevelingDto {
    @IsNumber()
    id: number;
  
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

    @IsOptional()
    @IsBoolean()
    habilited: boolean = false; // Valor por defecto: false
    
  }
