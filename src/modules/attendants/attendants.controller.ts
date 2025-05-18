import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { AttendantsService } from './attendants.service';
import { CreateAttendantDto } from './dto/create-attendant.dto';

@Controller('attendants')
export class AttendantsController {
  constructor(private readonly attendantsService: AttendantsService) {}
  
  @Post()
  create(@Body() createAttendantDto: CreateAttendantDto | CreateAttendantDto[]) {
    return this.attendantsService.create(createAttendantDto);
  }

  @Get()
  findAll() {
    return this.attendantsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.attendantsService.findOne(id);
  }

  @Get('student/:studentId')
  findByStudent(@Param('studentId') studentId: number) {
    return this.attendantsService.findByStudent(studentId);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateAttendantDto: CreateAttendantDto) {
    return this.attendantsService.update(id, updateAttendantDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.attendantsService.remove(id);
  }
}