import { IsNotEmpty, IsNumber, IsString, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAchievementDetailDto {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  ratingId: number; 

}

export class CreateAchievementDto {
  @IsNumber()
  @IsNotEmpty()
  year: number;

  @IsString()
  @IsNotEmpty()
  competence: string;

  @IsString()
  @IsNotEmpty()
  aspect: string;

  @IsNumber()
  @IsNotEmpty()
  administratorId: number;

  @IsNumber()
  @IsNotEmpty()
  degreeId: number;

  @IsNumber()
  @IsNotEmpty()
  trainingAreaId: number;

  @IsNumber()
  @IsNotEmpty()
  periodDetailId: number;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateAchievementDetailDto)
  details?: CreateAchievementDetailDto[];

    
   @IsOptional()
  status: string;
  
  
}