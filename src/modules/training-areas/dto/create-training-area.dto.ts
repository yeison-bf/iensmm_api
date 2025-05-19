import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateTrainingAreaDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsNumber()
  @IsOptional()
  institution: number;

  @IsNumber()
  @IsOptional()
  trainingCoreId: number;
}