import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsArray, IsOptional, ValidateNested } from 'class-validator';
import { CreatePeriodDetailDto } from 'src/modules/period-details/dto/create-period-detail.dto';
import { CreatePeriodDto } from 'src/modules/periods/dto/create-period.dto';

export class UpdatePeriodDto extends PartialType(CreatePeriodDto) {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreatePeriodDetailDto)
    periodDetails: CreatePeriodDetailDto[];

}
