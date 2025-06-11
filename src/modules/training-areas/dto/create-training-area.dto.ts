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
  programId?: number

  @IsNumber()
  @IsOptional() // Marca como opcional
  trainingCoreId?: number; // Usa el operador ? para indicar que es opcional

}