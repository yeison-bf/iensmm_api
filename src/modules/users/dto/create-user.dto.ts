import { IsString, IsNotEmpty, Length, IsEmail, IsOptional, IsNumber, IsArray } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  document: string;

  @IsEmail()
  @IsEmail(undefined, { message: 'Invalid email format' })
  notificationEmail: string | null;

  @IsString()
  @IsNotEmpty()
  @Length(1, 20)
  phone: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 1)
  gender: string;

  @IsString()
  @IsOptional()
  photoUrl?: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsNumber()
  @IsNotEmpty()
  roleId: number;

  @IsNumber()
  @IsNotEmpty()
  documentTypeId: number;

  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  headquarterIds?: number[];

  @IsString()
  @IsOptional()
  birthDate?: string;

  @IsNumber()
  @IsNotEmpty()
  institution: number;
  
}