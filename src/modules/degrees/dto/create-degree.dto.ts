import { IsString, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class CreateDegreeDto {
  @IsNumber()
  value: Number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  program: string;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  programId: number;
}