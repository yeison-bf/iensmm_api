import { IsArray, IsString, IsBoolean, IsNumber, IsEmail, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class RecipientDto {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  headquarters: string;
}

export class CreateNotificationDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RecipientDto)
  recipients: RecipientDto[];

  @IsString()
  subject: string;

  @IsString()
  body: string;

  @IsString()
  timestamp: string;

  @IsNumber()
  totalRecipients: number;

  @IsNumber()
  instiution: number;
  
  @IsOptional()
  @IsBoolean()
  status?: boolean;
}

export class UpdateNotificationDto {
  @IsOptional()
  @IsString()
  subject?: string;

  @IsOptional()
  @IsString()
  body?: string;

  @IsOptional()
  @IsBoolean()
  status?: boolean;
}