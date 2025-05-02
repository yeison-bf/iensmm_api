import { PartialType } from '@nestjs/mapped-types';
import { CreatePeriodDto } from 'src/modules/periods/dto/create-period.dto';

export class UpdatePeriodDto extends PartialType(CreatePeriodDto) {}
