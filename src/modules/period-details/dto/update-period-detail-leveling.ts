import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class UpdatePerioDetailLevelingDto {
    
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
    hasRecovery: boolean = false; 

    @IsOptional()
    @IsBoolean()
    hasLeveling: boolean = false; 
}
