import { Controller, Get, Post, Body, Put, Param, Delete, Query } from '@nestjs/common';
import { TrainingAreasService } from './training-areas.service';
import { CreateTrainingAreaDto } from './dto/create-training-area.dto';
import { UpdateTrainingAreaDto } from './dto/update-training-area.dto';

@Controller('training-areas')
export class TrainingAreasController {
  constructor(private readonly trainingAreasService: TrainingAreasService) {}

  @Post()
  create(@Body() createTrainingAreaDto: CreateTrainingAreaDto) {
    return this.trainingAreasService.create(createTrainingAreaDto);
  }

    @Get()
  findAll(@Query('institution') institution?: number) {
    return this.trainingAreasService.findAll(institution);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.trainingAreasService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateTrainingAreaDto: UpdateTrainingAreaDto) {
    return this.trainingAreasService.update(id, updateTrainingAreaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.trainingAreasService.remove(id);
  }
}