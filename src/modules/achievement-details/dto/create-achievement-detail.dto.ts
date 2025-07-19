import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateAchievementDetailDto {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  achievementId: number;

  @IsNumber()
  @IsNotEmpty()
  ratingId: number;


}