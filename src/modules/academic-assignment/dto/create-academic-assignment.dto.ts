import { IsNumber, IsBoolean, IsOptional, IsDateString, IsArray, ValidateNested, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

class AcademicAssignmentDetailDto {
  @IsInt()
  academicThinkingDetailId: number;

  @IsInt()
  administratorId: number;
}



export class CreateAcademicAssignmentDto {
  @IsInt()
  year: number;

  @IsInt()
  degreeId: number;

  @IsInt()
  headquarterId: number;

  @IsInt()
  programId: number;

  @IsInt()
  groupId: number;

  @IsNumber()
  @IsOptional()
  directorGroupId?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AcademicAssignmentDetailDto)
  details: AcademicAssignmentDetailDto[];
}