import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateProgramDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  status?: boolean;
}