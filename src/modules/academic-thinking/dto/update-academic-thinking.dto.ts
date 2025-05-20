import { PartialType } from '@nestjs/mapped-types';
import { CreateAcademicThinkingDto } from './create-academic-thinking.dto';

export class UpdateAcademicThinkingDto extends PartialType(CreateAcademicThinkingDto) {}
