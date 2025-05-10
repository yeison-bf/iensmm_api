import { IsString, IsEmail, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateHeadquartersDto {

  @IsString()
  @IsNotEmpty()
  icon: string;

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
  @IsEmail(undefined, { message: 'Invalid email format' })
  email: string | null;

  @IsNumber()
  @IsNotEmpty()
  institutionId: number;
}