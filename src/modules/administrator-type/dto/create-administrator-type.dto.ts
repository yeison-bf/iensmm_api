import { IsString, IsNotEmpty, Length } from 'class-validator';

export class CreateAdministratorTypeDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  name: string;
}