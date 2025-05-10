import { Controller, Get, Post, Body, Param, Put, Delete, ParseIntPipe, Query } from '@nestjs/common';
import { HeadquartersService } from './headquarters.service';
import { CreateHeadquartersDto } from './dto/create-headquarters.dto';
import { UpdateHeadquartersDto } from './dto/update-headquarters.dto';

@Controller('headquarters')
export class HeadquartersController {
  constructor(private readonly headquartersService: HeadquartersService) { }

  @Post()
  async create(@Body() createHeadquartersDto: CreateHeadquartersDto) {
    return await this.headquartersService.create(createHeadquartersDto);
  }

  @Get()
  async findAll(@Query('institutionId', new ParseIntPipe({ optional: true })) institutionId?: number) {
    return await this.headquartersService.findAll(institutionId);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.headquartersService.findOne(id);
  }

  @Get('daneCode/:id')
  async findOneDaneCode(
    @Param('id') id: string,
    @Query('institutions', new ParseIntPipe({ optional: true })) institutionId?: number
  ) {
    return await this.headquartersService.findOneDaneCode(id, institutionId);
  }
  
  @Get('email/:id')
  async findOneEmail(
    @Param('id') id: string,
    @Query('institutionId', new ParseIntPipe({ optional: true })) institutionId?: number
  ) {
    return await this.headquartersService.findOneEmail(id, institutionId);
  }
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateHeadquartersDto: UpdateHeadquartersDto,
  ) {
    return await this.headquartersService.update(id, updateHeadquartersDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return await this.headquartersService.remove(id);
  }
}