import { Controller, Get, Post, Body, Put, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
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
  findAll(
    @Query('institutionId') institutionId?: number,
    @Query('programId') programId?: number,
    @Query('year') year?: number,
  ) {
    return this.periodsService.findAll(institutionId, programId, year);
  }

  
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.periodsService.findOne(id);
  }

  @Get('year/:id')
  findOneYear(
    @Param('id') id: number,
    @Query('institutions', new ParseIntPipe({ optional: true })) institutionId?: number
  ) {
    return this.periodsService.findOneYear(id, institutionId);
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