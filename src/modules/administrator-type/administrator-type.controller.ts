import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { AdministratorTypeService } from './administrator-type.service';
import { CreateAdministratorTypeDto } from './dto/create-administrator-type.dto';
import { UpdateAdministratorTypeDto } from './dto/update-administrator-type.dto';

@Controller('administrator-type')
export class AdministratorTypeController {
  constructor(private readonly administratorTypeService: AdministratorTypeService) {}

  @Post()
  create(@Body() createAdministratorTypeDto: CreateAdministratorTypeDto) {
    return this.administratorTypeService.create(createAdministratorTypeDto);
  }

  @Get()
  findAll() {
    return this.administratorTypeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.administratorTypeService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateAdministratorTypeDto: UpdateAdministratorTypeDto) {
    return this.administratorTypeService.update(id, updateAdministratorTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.administratorTypeService.remove(id);
  }
}