import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateScheduleDto {
  @IsNotEmpty()
  @IsString()
  urlImagen: string;

  @IsNotEmpty()
  @IsNumber()
  degreeId: number;

  @IsNotEmpty()
  @IsNumber()
  anio: number;
}
