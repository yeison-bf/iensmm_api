
// DTO específico para toggle habilited
import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ToggleHabilitedDto {
    @IsNumber()
    @IsNotEmpty()
    id: number;

    @Type(() => Date)
    @IsDate()
    @IsNotEmpty()
    endDate: Date;

    @IsString()
    @IsNotEmpty()
    status: string;

    @IsBoolean()
    @IsNotEmpty()
    habilited: boolean;
}