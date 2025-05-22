import { IsNumber, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateAcademicThinkingDto, CreateAcademicThinkingDetailDto } from './create-academic-thinking.dto';

export class UpdateAcademicThinkingDetailDto extends CreateAcademicThinkingDetailDto {
  @IsNumber()
  @IsOptional()
  id?: number;
}

export class UpdateAcademicThinkingDto extends CreateAcademicThinkingDto {
  @IsNumber()
  @IsOptional()
  id?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateAcademicThinkingDetailDto)
  details: UpdateAcademicThinkingDetailDto[];
}