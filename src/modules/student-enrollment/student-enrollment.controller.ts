import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { StudentEnrollmentService } from './student-enrollment.service';
import { CreateStudentEnrollmentDto } from './dto/create-student-enrollment.dto';

@Controller('student-enrollment')
export class StudentEnrollmentController {
  constructor(private readonly enrollmentService: StudentEnrollmentService) {}

  @Post()
  create(@Body() createEnrollmentDto: CreateStudentEnrollmentDto) {
    return this.enrollmentService.create(createEnrollmentDto);
  }

  @Get()
  findAll() {
    return this.enrollmentService.findAll();
  }

  // Add other endpoints as needed
}