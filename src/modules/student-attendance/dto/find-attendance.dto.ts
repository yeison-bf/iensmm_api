import { IsDateString, IsNumber, IsNotEmpty, IsNumberString } from 'class-validator';

export class FindAttendanceDto {
    @IsDateString()
    @IsNotEmpty()
    date: Date;

    @IsNumberString()
    @IsNotEmpty()
    trainingAreaId: string;

    @IsNumberString()
    @IsNotEmpty()
    degreeId: string;

    @IsNumberString()
    @IsNotEmpty()
    groupId: string;
}