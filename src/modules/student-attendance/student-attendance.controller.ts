import { Controller, Get, Post, Body, Put, Param, Delete, Query } from '@nestjs/common';
import { StudentAttendanceService } from './student-attendance.service';
import { CreateStudentAttendanceDto } from './dto/create-student-attendance.dto';
import { UpdateStudentAttendanceDto } from './dto/update-student-attendance.dto';
import { FindAttendanceDto } from './dto/find-attendance.dto';

@Controller('student-attendance')
export class StudentAttendanceController {
  constructor(private readonly studentAttendanceService: StudentAttendanceService) {}

  @Post()
  createMany(@Body() createDtos: CreateStudentAttendanceDto[]) {
    return this.studentAttendanceService.create(createDtos);
  }

  @Get()
  findByCriteria(@Query() findDto: FindAttendanceDto) {
    return this.studentAttendanceService.findByCriteria(findDto);
  }


  @Get()
  findAll(
    @Query('studentId') studentId?: number,
    @Query('trainingAreaId') trainingAreaId?: number,
    @Query('startDate') startDate?: Date,
    @Query('endDate') endDate?: Date,
  ) {
    return this.studentAttendanceService.findAll(studentId, trainingAreaId, startDate, endDate);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.studentAttendanceService.findOne(id);
  }

  @Put(':id')
  update(@Body() updateDtos: UpdateStudentAttendanceDto[]) {
    return this.studentAttendanceService.update(updateDtos);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.studentAttendanceService.remove(id);
  }
}