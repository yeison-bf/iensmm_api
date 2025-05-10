import { IsString, IsNotEmpty } from 'class-validator';

export class CreateDegreeDto {
  @IsString()
  @IsNotEmpty()
  value: string;

  @IsString()
  @IsNotEmpty()
  name: string;

}