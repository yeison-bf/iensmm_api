import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateTrainingAreaDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  trainingCoreId: number;
}