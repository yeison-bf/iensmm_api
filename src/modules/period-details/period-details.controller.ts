import { Controller, Get, Post, Body, Put, Param, Delete, Query, ParseIntPipe, BadRequestException } from '@nestjs/common';
import { PeriodDetailsService } from './period-details.service';
import { CreatePeriodDetailDto } from './dto/create-period-detail.dto';
import { UpdatePerioDetaildDto } from './dto/update-period-detail.dto';

@Controller('period-details')
export class PeriodDetailsController {
  constructor(private readonly periodDetailsService: PeriodDetailsService) { }

  @Post()
  create(@Body() createPeriodDetailDto: CreatePeriodDetailDto) {
    return this.periodDetailsService.create(createPeriodDetailDto);
  }

  @Get()
  findAll() {
    return this.periodDetailsService.findAll();
  }

  // 🔥 RUTAS ESPECÍFICAS PRIMERO (antes que las rutas con parámetros)
  @Get('period/:periodId')
  findByPeriod(@Param('periodId') periodId: number) {
    return this.periodDetailsService.findByPeriod(periodId);
  }

  @Get('active/:periodId')
  findActivePeriod(@Param('periodId') periodId: number) {
    return this.periodDetailsService.findActivePeriod(periodId);
  }

// 🧪 TOGGLE STATE - VERSION SUPER SIMPLE PARA DEBUGGING
@Put('toggle-state')
togglePeriodState(
  @Query('closeId') closeId?: string,
  @Query('activeId') activeId?: string,
) {
  // Función helper para convertir valores
  const parseId = (value: string | undefined): number | undefined => {
    // Si no existe, está vacío, o es 'null' string, retorna undefined
    if (!value || value.trim() === '' || value.toLowerCase() === 'null') {
      return undefined;
    }
    
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? undefined : parsed;
  };
  
  // Convertir strings a números manejando 'null' string
  const closeIdNum = parseId(closeId);
  const activeIdNum = parseId(activeId);
  
  // Validar que al menos uno de los parámetros sea válido
  if (!closeIdNum && !activeIdNum) {
    throw new BadRequestException('Al menos uno de closeId o activeId debe ser proporcionado');
  }
  
  // Llamar al servicio (ya no necesitamos validar NaN porque parseId lo maneja)
  return this.periodDetailsService.togglePeriodState(closeIdNum, activeIdNum);
}



  @Put('status/:id')
  updateStatus(@Param('id') id: number, @Body('status') status: string) {
    return this.periodDetailsService.updateStatus(id, status);
  }

  // 🔥 RUTAS CON PARÁMETROS DINÁMICOS AL FINAL
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.periodDetailsService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updatePeriodDetailDto: UpdatePerioDetaildDto) {
    return this.periodDetailsService.update(id, updatePeriodDetailDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.periodDetailsService.remove(id);
  }
}