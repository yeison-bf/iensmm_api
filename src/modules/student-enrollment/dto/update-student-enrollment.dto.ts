import { PartialType } from '@nestjs/mapped-types';
import { CreateStudentEnrollmentDto } from './create-student-enrollment.dto';

export class UpdateStudentEnrollmentDto extends PartialType(CreateStudentEnrollmentDto) {}
