import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsOptional } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  studentInfo?: {
    birthDate?: Date;
    bloodType?: string;
    birthDepartment?: string;
    birthCity?: string;
    population?: string;
    disability?: boolean;
    disabilityType?: string;
    healthProvider?: string;
    observations?: string;
  };
}