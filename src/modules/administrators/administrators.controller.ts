import { Controller, Get, Post, Body, Put, Param, Delete, Query } from '@nestjs/common';
import { AdministratorsService } from './administrators.service';
import { CreateAdministratorDto } from './dto/create-administrator.dto';
import { UpdateAdministratorDto } from './dto/update-administrator.dto';

@Controller('administrators')
export class AdministratorsController {
  constructor(private readonly administratorsService: AdministratorsService) {}

  @Post()
  create(@Body() createAdministratorDto: CreateAdministratorDto) {
    return this.administratorsService.create(createAdministratorDto);
  }
  @Get()
  findAll(@Query('institution') institution?: number) {
    return this.administratorsService.findAll(institution);
  }

  
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.administratorsService.findOne(id);
  }




  @Put(':id')
  update(@Param('id') id: number, @Body() updateAdministratorDto: UpdateAdministratorDto) {
    return this.administratorsService.update(id, updateAdministratorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.administratorsService.remove(id);
  }
}