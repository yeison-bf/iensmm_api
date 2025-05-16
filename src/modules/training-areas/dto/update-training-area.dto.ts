import { PartialType } from '@nestjs/mapped-types';
import { CreateTrainingAreaDto } from './create-training-area.dto';

export class UpdateTrainingAreaDto extends PartialType(CreateTrainingAreaDto) {}
