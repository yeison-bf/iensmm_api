import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put } from '@nestjs/common';
import { AcademicAssignmentService } from './academic-assignment.service';
import { CreateAcademicAssignmentDto } from './dto/create-academic-assignment.dto';
import { UpdateAcademicAssignmentDto } from './dto/update-academic-assignment.dto';

@Controller('academic-assignment')
export class AcademicAssignmentController {
  constructor(private readonly academicAssignmentService: AcademicAssignmentService) { }

  @Post()
  create(@Body() createAcademicAssignmentDto: CreateAcademicAssignmentDto) {
    return this.academicAssignmentService.create(createAcademicAssignmentDto);
  }

  @Get()
  findAll(
    @Query('headquarterId') headquarterId?: number,
    @Query('programId') programId?: number,
  ) {
    return this.academicAssignmentService.findAll(headquarterId, programId);
  }

  @Get('rating')
  findAllByRatign(
    @Query('headquarterId') headquarterId?: number,
    @Query('programId') programId?: number,
    @Query('groupId') groupId?: number,
    @Query('degreeId') degreeId?: number,
  ) {
    return this.academicAssignmentService.findAllByRatign(headquarterId, programId, groupId, degreeId);
  }




  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.academicAssignmentService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateAcademicAssignmentDto: UpdateAcademicAssignmentDto) {
    return this.academicAssignmentService.update(+id, updateAcademicAssignmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.academicAssignmentService.remove(+id);
  }
}
