import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { TrainingCoresService } from './training-cores.service';
import { CreateTrainingCoreDto } from './dto/create-training-core.dto';
import { UpdateTrainingCoreDto } from './dto/update-training-core.dto';

@Controller('training-cores')
export class TrainingCoresController {
  constructor(private readonly trainingCoresService: TrainingCoresService) {}

  @Post()
  create(@Body() createTrainingCoreDto: CreateTrainingCoreDto) {
    return this.trainingCoresService.create(createTrainingCoreDto);
  }

  @Get()
  findAll() {
    return this.trainingCoresService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.trainingCoresService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateTrainingCoreDto: UpdateTrainingCoreDto) {
    return this.trainingCoresService.update(id, updateTrainingCoreDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.trainingCoresService.remove(id);
  }
}