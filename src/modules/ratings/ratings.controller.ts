import { Controller, Get, Post, Body, Put, Param, Delete, Query } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';

@Controller('ratings')
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  @Post()
  create(@Body() createRatingDto: CreateRatingDto) {
    return this.ratingsService.create(createRatingDto);
  }

  @Get()
  findAll(
    @Query('institutionId') institutionId?: number,
  ) {
    return this.ratingsService.findAll(institutionId);
  }    

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.ratingsService.findOne(id);
  }


  @Get('name/:name')
  findOneByName(
    @Param('name') name: string,
    @Query('institutionId') institutionId?: number
  ) {
    return this.ratingsService.findOneName(name, institutionId);
  }



  @Put(':id')
  update(@Param('id') id: number, @Body() updateRatingDto: UpdateRatingDto) {
    return this.ratingsService.update(id, updateRatingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.ratingsService.remove(id);
  }
}