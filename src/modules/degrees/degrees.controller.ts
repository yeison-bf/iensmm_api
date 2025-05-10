import { Controller, Get, Post, Body, Put, Param, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { DegreesService } from './degrees.service';
import { CreateDegreeDto } from './dto/create-degree.dto';
import { UpdateDegreeDto } from './dto/update-degree.dto';

@Controller('degrees')
export class DegreesController {
  constructor(private readonly degreesService: DegreesService) {}

  @Post()
  async create(@Body() createDegreeDto: CreateDegreeDto) {
    try {
      const result:any = await this.degreesService.create(createDegreeDto);
      if (!result.success) {
        throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
      }
      return result;
    } catch (error) {
      throw new HttpException(
        error.message || 'Error creating degree',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get()
  async findAll() {
    try {
      const result:any = await this.degreesService.findAll();
      if (!result.success) {
        throw new HttpException(result.message, HttpStatus.NOT_FOUND);
      }
      return result;
    } catch (error) {
      throw new HttpException(
        error.message || 'Error retrieving degrees',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    try {
      const result:any = await this.degreesService.findOne(id);
      if (!result.success) {
        throw new HttpException(result.message, HttpStatus.NOT_FOUND);
      }
      return result;
    } catch (error) {
      throw new HttpException(
        error.message || 'Error retrieving degree',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateDegreeDto: UpdateDegreeDto) {
    try {
      const result:any = await this.degreesService.update(id, updateDegreeDto);
      if (!result.success) {
        throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
      }
      return result;
    } catch (error) {
      throw new HttpException(
        error.message || 'Error updating degree',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    try {
      const result:any = await this.degreesService.remove(id);
      if (!result.success) {
        throw new HttpException(result.message, HttpStatus.NOT_FOUND);
      }
      return result;
    } catch (error) {
      throw new HttpException(
        error.message || 'Error deleting degree',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}