import { Controller, Get, Post, Body, Put, Param, Delete, Query } from '@nestjs/common';
import { AchievementsService } from './achievements.service';
import { CreateAchievementDto } from './dto/create-achievement.dto';
import { UpdateAchievementDto } from './dto/update-achievement.dto';

@Controller('achievements')
export class AchievementsController {
  constructor(private readonly achievementsService: AchievementsService) { }

  @Post()
  create(@Body() createAchievementDto: CreateAchievementDto) {
    return this.achievementsService.create(createAchievementDto);
  }

  @Get()
  findAll(
    @Query('degreeIds') degreeIds: number,
    @Query('year') year: number,
  ) {
    return this.achievementsService.findAll(degreeIds, year);
  }

  @Get('by-degrees')
  findByDegreesAndPeriod(
    @Query('degreeIds') degreeIds: string,
    @Query('periodDetailId') periodDetailId: string,
    @Query('year') year: string,
  ) {
    const degreeIdsArray = degreeIds.split(',').map(id => parseInt(id));
    return this.achievementsService.findByDegreesAndPeriod(
      degreeIdsArray,
      parseInt(periodDetailId),
      parseInt(year)
    );
  }


  @Get(':id')
  findOne(@Param('id') id: number,
    @Query('degreeIds') degreeIds: number,
    @Query('periodDetailId') periodDetailId: number,
    @Query('year') year: number
  ) {
    return this.achievementsService.findOne(id, degreeIds, periodDetailId, year);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateAchievementDto: UpdateAchievementDto) {
    return this.achievementsService.update(+id, updateAchievementDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.achievementsService.remove(+id);
  }
}