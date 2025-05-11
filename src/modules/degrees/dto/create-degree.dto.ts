import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateDegreeDto {
  @IsNumber()
  value: Number;

  @IsString()
  @IsNotEmpty()
  name: string;
}