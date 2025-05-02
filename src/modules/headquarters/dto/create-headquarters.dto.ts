import { IsString, IsEmail, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateHeadquartersDto {
  @IsString()
  @IsNotEmpty()
  daneCode: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  zone: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNumber()
  @IsNotEmpty()
  institutionId: number;
}