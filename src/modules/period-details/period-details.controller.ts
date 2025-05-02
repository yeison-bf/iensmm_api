import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { PeriodDetailsService } from './period-details.service';
import { CreatePeriodDetailDto } from './dto/create-period-detail.dto';
import { UpdatePerioDetaildDto } from './dto/update-period-detail.dto';

@Controller('period-details')
export class PeriodDetailsController {
  constructor(private readonly periodDetailsService: PeriodDetailsService) {}

  @Post()
  create(@Body() createPeriodDetailDto: CreatePeriodDetailDto) {
    return this.periodDetailsService.create(createPeriodDetailDto);
  }

  @Get()
  findAll() {
    return this.periodDetailsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.periodDetailsService.findOne(id);
  }

  @Get('period/:periodId')
  findByPeriod(@Param('periodId') periodId: number) {
    return this.periodDetailsService.findByPeriod(periodId);
  }

  @Get('active/:periodId')
  findActivePeriod(@Param('periodId') periodId: number) {
    return this.periodDetailsService.findActivePeriod(periodId);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updatePeriodDetailDto: UpdatePerioDetaildDto) {
    return this.periodDetailsService.update(id, updatePeriodDetailDto);
  }

  @Put('status/:id')
  updateStatus(@Param('id') id: number, @Body('status') status: string) {
    return this.periodDetailsService.updateStatus(id, status);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.periodDetailsService.remove(id);
  }
}