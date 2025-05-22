import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Query } from '@nestjs/common';
import { AcademicThinkingService } from './academic-thinking.service';
import { CreateAcademicThinkingDto } from './dto/create-academic-thinking.dto';
import { UpdateAcademicThinkingDto } from './dto/update-academic-thinking.dto';

@Controller('academic-thinking')
export class AcademicThinkingController {
  constructor(private readonly academicThinkingService: AcademicThinkingService) { }

  @Post()
  create(@Body() createAcademicThinkingDto: CreateAcademicThinkingDto) {
    return this.academicThinkingService.create(createAcademicThinkingDto);
  }

  @Get()
  findAll(@Query('headquarters') headquarters?: string) {
    return this.academicThinkingService.findAll(headquarters ? +headquarters : null);
  }

  @Get('search')
  search(
    @Query('year') year?: string,
    @Query('grade') gradeId?: string,
    @Query('headquarters') headquarterId?: string,
  ) {
    console.log(year, gradeId, headquarterId);

    return this.academicThinkingService.search(
      year ? +year : null,
      gradeId ? +gradeId : null,
      headquarterId ? +headquarterId : null
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.academicThinkingService.findOne(+id);
  }





  @Put(':id')
  update(@Param('id') id: string, @Body() updateAcademicThinkingDto: UpdateAcademicThinkingDto) {
    return this.academicThinkingService.update(+id, updateAcademicThinkingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.academicThinkingService.remove(+id);
  }
}
