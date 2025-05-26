import { Controller, Get, Post, Body, Param, Delete, Put, Query } from '@nestjs/common';
import { StudentEnrollmentService } from './student-enrollment.service';
import { CreateStudentEnrollmentDto } from './dto/create-student-enrollment.dto';

@Controller('student-enrollment')
export class StudentEnrollmentController {
  constructor(private readonly enrollmentService: StudentEnrollmentService) { }

  @Post()
  create(@Body() createEnrollmentDto: CreateStudentEnrollmentDto) {
    return this.enrollmentService.create(createEnrollmentDto);
  }

  @Get()
  findAll(
    @Query('sede') headquarterId?: number, 
    @Query('year') year?: string,
    @Query('programId') programId?: number
  ) {
    return this.enrollmentService.findAll(headquarterId, year, programId);
  }


  @Get('raitng')
  findAllDegree(
    @Query('sede') headquarterId?: number, 
    @Query('year') year?: string,
    @Query('programId') programId?: number
  ) {
    return this.enrollmentService.findAllDegree(headquarterId, year, programId);
  }



  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() updateEnrollmentDto: CreateStudentEnrollmentDto,
  ) {
    return this.enrollmentService.update(id, updateEnrollmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.enrollmentService.remove(id);
  }
}