import { Controller, Get, Post, Body, Put, Param, Delete, Query, ParseBoolPipe, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { StudentGradesService } from './student-grades.service';
import { CreateStudentGradeDto } from './dto/create-student-grade.dto';
import { UpdateStudentGradesBulkDto } from './dto/update-student-grade.dto';

@Controller('student-grades')
export class StudentGradesController {
  constructor(private readonly studentGradesService: StudentGradesService) { }

  // ======== Rutas Específicas (Más específicas primero) ========
  @Get('list/leveling')
  async findByTeacherAndYear(
    @Query('teacherId', ParseIntPipe) teacherId: number,
    @Query('year', new DefaultValuePipe(new Date().getFullYear()), ParseIntPipe) year: number,
    @Query('onlyLowGrades', new ParseBoolPipe({ optional: true })) onlyLowGrades: boolean = true
  ) {
    return this.studentGradesService.findByTeacherAndYear(teacherId, year, onlyLowGrades);
  }

  @Get('voletin/filtered')
  findByFiltersVoletin(
    @Query('groupId') groupId?: number,
    @Query('degreeId') degreeId?: number,
    @Query('thinkingDetailId') thinkingDetailId?: number,
    @Query('periodDetailId') periodDetailId?: number
  ) {
    return this.studentGradesService.findByFiltersVoletin(groupId, degreeId, thinkingDetailId, periodDetailId);
  }

  @Get('trainignArea/filtered')
  findByFiltersTrainignArea(
    @Query('groupId') groupId?: number,
    @Query('degreeId') degreeId?: number,
    @Query('periodDetailId') periodDetailId?: number
  ) {
    return this.studentGradesService.findByFiltersTrainignArea(groupId, degreeId, periodDetailId);
  }

  @Get('leveling')
  findByFiltersLeveling(
    @Query('groupId') groupId?: number,
    @Query('degreeId') degreeId?: number,
    @Query('thinkingDetailId') thinkingDetailId?: number,
    @Query('periodDetailId') periodDetailId?: number,
    @Query('onlyLowGrades', new ParseBoolPipe({ optional: true })) onlyLowGrades?: boolean
  ) {
    return this.studentGradesService.findByFiltersLeveling(
      groupId, 
      degreeId, 
      thinkingDetailId, 
      periodDetailId,
      onlyLowGrades ?? true
    );
  }

  // ======== Rutas Genéricas (Más generales después) ========
  @Get('filtered')
  findByFilters(
    @Query('groupId') groupId?: number,
    @Query('degreeId') degreeId?: number,
    @Query('thinkingDetailId') thinkingDetailId?: number,
    @Query('periodDetailId') periodDetailId?: number
  ) {
    return this.studentGradesService.findByFilters(groupId, degreeId, thinkingDetailId, periodDetailId);
  }

  @Get()
  findAll(
    @Query('studentId') studentId?: number,
    @Query('periodId') periodId?: number,
    @Query('teacherId') teacherId?: number,
    @Query('thinkingDetailId') thinkingDetailId?: number
  ) {
    return this.studentGradesService.findAll(studentId, periodId, teacherId, thinkingDetailId);
  }

  // ======== CRUD Básico ========
  @Post()
  create(@Body() createGradeDto: CreateStudentGradeDto) {
    return this.studentGradesService.create(createGradeDto);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.studentGradesService.findOne(id);
  }

  @Put('bulk-update')
  updateBulk(@Body() updateGradesDto: UpdateStudentGradesBulkDto) {
    return this.studentGradesService.updateBulk(updateGradesDto);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateGradeDto: UpdateStudentGradesBulkDto) {
    return this.studentGradesService.update(id, updateGradeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.studentGradesService.remove(id);
  }
}