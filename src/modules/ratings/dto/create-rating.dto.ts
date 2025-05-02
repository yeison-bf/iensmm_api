import { IsString, IsNumber, IsNotEmpty, Length, Min, Max } from 'class-validator';

export class CreateRatingDto {
  @IsString()
  @IsNotEmpty()
  letterValue: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(1.0)
  @Max(5.0)
  minRange: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(1.0)
  @Max(5.0)
  maxRange: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(2000)
  @Max(2100)
  year: number;

  @IsNumber()
  @IsNotEmpty()
  institutionId: number;
}