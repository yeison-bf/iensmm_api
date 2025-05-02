import {
    IsString,
    IsOptional,
    IsNotEmpty,
    IsNumber,
    IsEmail,
    IsUrl,
    IsBoolean,
} from 'class-validator';

export class CreateInstitutionDto {
    @IsString()
    @IsNotEmpty()
    daneCode: string;

    @IsString()
    @IsNotEmpty()
    nit: string;

    @IsString()
    @IsNotEmpty()
    icfesCode: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    address: string;

    @IsString()
    neighborhood: string;

    @IsString()
    department: string;

    @IsString()
    city: string;

    @IsString()
    zone: string;

    @IsString()
    phone: string;

    @IsUrl()
    @IsOptional()
    website?: string;

    @IsEmail()
    email: string;

    @IsString()
    sector: string;

    @IsString()
    nucleus: string;

    @IsString()
    territorialEntity: string;

    @IsString()
    calendar: string;

    @IsString()
    schedule: string;

    @IsNumber()
    numberOfHeadquarters: number;

    @IsString()
    servedPopulationGender: string;

    @IsString()
    resolution: string;

    @IsBoolean()
    fullTimeSchedule: boolean;

    @IsBoolean()
    morningSchedule: boolean;

    @IsBoolean()
    afternoonSchedule: boolean;

    @IsBoolean()
    nightSchedule: boolean;

    @IsBoolean()
    weekendSchedule: boolean;

    @IsString()
    @IsOptional()
    flagImg?: string;

    @IsString()
    @IsOptional()
    shieldImg?: string;

    @IsString()
    @IsOptional()
    idCardModelImg?: string;

    @IsString()
    @IsOptional()
    letterheadImg?: string;
}