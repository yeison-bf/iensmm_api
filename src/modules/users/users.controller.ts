import { Controller, Get, Post, Body, Put, Param, Delete, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserWithStudentDto } from './dto/create-user-with-student.dto';
import { UpdateUserWithStudentDto } from './dto/update-user-with-student.dto';
import { CreateUserWithAdministratorDto } from './dto/create-user-with-administrator.dto';
import { BulkCreateStudentDto } from './dto/bulk-create-students.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('with-student')
  createWithStudent(@Body() createUserWithStudentDto: CreateUserWithStudentDto) {
    return this.usersService.createWithStudent(createUserWithStudentDto);
  }


  @Post('with-administrator')
  createWithAdministrator(@Body() createUserWithAdministratorDto: CreateUserWithAdministratorDto) {
    return this.usersService.createWithAdministrator(createUserWithAdministratorDto);
  }


  @Post('login')
  login(@Body() loginDto: { username: string; password: string }) {
    return this.usersService.login(loginDto.username, loginDto.password);
  }

  @Post('bulk-create')
  bulkCreateStudents(@Body() students: BulkCreateStudentDto[]) {
    return this.usersService.bulkCreateStudents(students);
  }


  @Get()
  findAll() {
    return this.usersService.findAll();
  }


  
  @Get('/students/search')
  async getAllStudents(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('headquarterId') headquarterId?: string,
    @Query('programId') programId?: string,
    @Query('search') search?: string,
  ) {
    return this.usersService.getAllStudents(
      parseInt(page),
      parseInt(limit),
      headquarterId ? parseInt(headquarterId) : undefined,
      programId ? parseInt(programId) : undefined,
      search
    );
  }


  @Get('/administrators')
  findAllAdministrators(@Query('institutionId') institutionId?: number) {
    return this.usersService.findAllAdministrators(institutionId);
  }


  @Get('/administrators/program')
  findAllAdministratorsProgram(
    @Query('programId') programId?: number,
    @Query('institutionId') institutionId?: number
  ) {
    return this.usersService.findAllAdministratorsProgram(programId, institutionId);
  }


  @Get('students')
  findAllStudents(
    @Query('sede') headquarterId?: number,
    @Query('programId') programId?: number,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ) {
    return this.usersService.findAllStudents(headquarterId, programId, page, limit);
  }

  @Get('students/:id')
  findOneStudents(@Param('id') id: number) {
    return this.usersService.findOneStudents(id);
  }

  @Get('recovery/:id')
  recoveryPassword(@Param('id') id: string) {
    return this.usersService.recoveryPassword(id);
  }

  @Get('administrators/:id')
  findOneAdministrator(@Param('id') id: number) {
    return this.usersService.findOneAdministrator(id);
  }

  @Get('document/:id')
  findOneDocument(@Param('id') id: string) {
    return this.usersService.findOneDocument(id);
  }


  @Get('userName/:id')
  findOneUserName(@Param('id') id: string) {
    return this.usersService.findOneUserName(id);
  }



  @Put('students/:id')
  updateWithStudent(@Param('id') id: number, @Body() updateDto: UpdateUserWithStudentDto) {
    return this.usersService.updateWithStudent(id, updateDto);
  }

  @Put('administrators/:id')
  updateWithAdministrator(@Param('id') id: number, @Body() updateDto: any) {
    return this.usersService.updateWithAdministrator(id, updateDto);
  }

  @Post('recovery/new')
  async setNewPassword(@Body() body: { username: string; newPassword: string }) {
    const { username, newPassword } = body;
    return this.usersService.updatePassword(username, newPassword);
  }


  @Delete('students/:id')
  removeStudent(@Param('id') id: number) {
    return this.usersService.removeStudent(id);
  }


  @Delete('administrators/:id')
  removeAdministrator(@Param('id') id: number) {
    return this.usersService.removeAdministrator(id);
  }

}