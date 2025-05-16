import { PartialType } from '@nestjs/mapped-types';
import { CreateTrainingCoreDto } from './create-training-core.dto';

export class UpdateTrainingCoreDto extends PartialType(CreateTrainingCoreDto) {}
