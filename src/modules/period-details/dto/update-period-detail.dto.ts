import { PartialType } from '@nestjs/mapped-types';
import { CreatePeriodDetailDto } from './create-period-detail.dto';

export class UpdatePerioDetaildDto extends PartialType(CreatePeriodDetailDto) {}