import { Controller, Get, Post, Body, Put, Param, Delete, Query, ParseBoolPipe } from '@nestjs/common';
import { StudentGradesService } from './student-grades.service';
import { CreateStudentGradeDto } from './dto/create-student-grade.dto';
import { UpdateStudentGradesBulkDto } from './dto/update-student-grade.dto';

@Controller('student-grades')
export class StudentGradesController {
  constructor(private readonly studentGradesService: StudentGradesService) { }

  @Post()
  create(@Body() createGradeDto: CreateStudentGradeDto) {
    return this.studentGradesService.create(createGradeDto);
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

  @Get('filtered')
  findByFilters(
    @Query('groupId') groupId?: number,
    @Query('degreeId') degreeId?: number,
    @Query('thinkingDetailId') thinkingDetailId?: number,
    @Query('periodDetailId') periodDetailId?: number
  ) {
    return this.studentGradesService.findByFilters(groupId, degreeId, thinkingDetailId, periodDetailId);
  }


  
  @Get('leveling')
  findByFiltersLeveling(
    @Query('groupId') groupId?: number,
    @Query('degreeId') degreeId?: number,
    @Query('thinkingDetailId') thinkingDetailId?: number,
    @Query('periodDetailId') periodDetailId?: number,
    @Query('onlyLowGrades', new ParseBoolPipe({ optional: true })) onlyLowGrades?: boolean // Usando ParseBoolPipe
  ) {
    return this.studentGradesService.findByFiltersLeveling(
      groupId, 
      degreeId, 
      thinkingDetailId, 
      periodDetailId,
      onlyLowGrades || false // Asegurando que siempre haya un valor booleano
    );
  }



    
  @Get('list/leveling')
  findByFiltersLevelingList(
    @Query('groupId') groupId?: number,
    @Query('degreeId') degreeId?: number,
    @Query('thinkingDetailId') thinkingDetailId?: number,
    @Query('periodDetailId') periodDetailId?: number,
    @Query('onlyLowGrades', new ParseBoolPipe({ optional: true })) onlyLowGrades?: boolean // Usando ParseBoolPipe
  ) {
    return this.studentGradesService.findByFiltersLevelingList(
      groupId, 
      degreeId, 
      thinkingDetailId, 
      periodDetailId,
      onlyLowGrades || false // Asegurando que siempre haya un valor booleano
    );
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