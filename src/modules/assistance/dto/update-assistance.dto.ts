import { PartialType } from '@nestjs/mapped-types';
import { CreateAssistanceDto } from './create-assistance.dto';

export class UpdateAssistanceDto extends PartialType(CreateAssistanceDto) {}
