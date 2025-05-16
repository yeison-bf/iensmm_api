import { IsString, IsNotEmpty } from 'class-validator';

export class CreateTrainingCoreDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}