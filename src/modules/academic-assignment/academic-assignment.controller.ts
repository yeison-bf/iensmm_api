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

  @Get('by-criteria')
  async findByCriteria(
    @Query('degreeId') degreeId: number,
    @Query('groupId') groupId: number,
    @Query('headquarterId') headquarterId: number,
    @Query('year') year: number,
  ) {
    return this.academicAssignmentService.findAssignmentByCriteria(
      Number(degreeId),
      Number(groupId),
      Number(headquarterId),
      Number(year)
    );
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

  @Get('teacher/:id/year/:year')
  findOneByTeacer(
    @Param('id') id: string,
    @Param('year') year: number
  ) {
    return this.academicAssignmentService.findOneByTeacher(+id, year);
  }


  
  @Get('degree/:id')
  findByDegreeYear(
    @Param('id') id: string,
    @Query('year') year: number,
    @Query('headquarterId') headquarterId: number,
    @Query('programId') programId: number,
  ) {
    return this.academicAssignmentService.findByDegreeYear(+id, year, headquarterId, programId);
  }



  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.academicAssignmentService.findOne(+id);
  }




  @Get('administrator/:id')
  findOneByTeacher(
    @Param('id') id: string,
    @Query('yeart') yeart?: number,
  ) {
    return this.academicAssignmentService.getAssignmentsByAdministrator(+id, yeart);
  }

  @Get('directGroup/:id')
  findOneByDirectGroup(@Param('id') id: string) {
    return this.academicAssignmentService.findOneByDirectGroup(+id);
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
