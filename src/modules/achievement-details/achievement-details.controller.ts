import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { AchievementDetailsService } from './achievement-details.service';
import { CreateAchievementDetailDto } from './dto/create-achievement-detail.dto';
import { UpdateAchievementDetailDto } from './dto/update-achievement-detail.dto';

@Controller('achievement-details')
export class AchievementDetailsController {
  constructor(private readonly achievementDetailsService: AchievementDetailsService) {}

  @Post()
  create(@Body() createAchievementDetailDto: CreateAchievementDetailDto) {
    return this.achievementDetailsService.create(createAchievementDetailDto);
  }

  @Get()
  findAll() {
    return this.achievementDetailsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.achievementDetailsService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateAchievementDetailDto: UpdateAchievementDetailDto) {
    return this.achievementDetailsService.update(+id, updateAchievementDetailDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.achievementDetailsService.remove(+id);
  }
}