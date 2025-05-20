import { PartialType } from '@nestjs/mapped-types';
import { CreateAcademicAssignmentDto } from './create-academic-assignment.dto';

export class UpdateAcademicAssignmentDto extends PartialType(CreateAcademicAssignmentDto) {}
