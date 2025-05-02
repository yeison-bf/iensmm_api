import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { PeriodsService } from './periods.service';
import { CreatePeriodDto } from './dto/create-period.dto';
import { UpdatePeriodDto } from './dto/update-period.dto';

@Controller('periods')
export class PeriodsController {
  constructor(private readonly periodsService: PeriodsService) {}

  @Post()
  create(@Body() createPeriodDto: CreatePeriodDto) {
    return this.periodsService.create(createPeriodDto);
  }

  @Get()
  findAll() {
    return this.periodsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.periodsService.findOne(id);
  }

  @Get('institution/:institutionId')
  findByInstitution(@Param('institutionId') institutionId: number) {
    return this.periodsService.findByInstitution(institutionId);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updatePeriodDto: UpdatePeriodDto) {
    return this.periodsService.update(id, updatePeriodDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.periodsService.remove(id);
  }
}