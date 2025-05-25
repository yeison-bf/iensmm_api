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


  @Get('/administrators')
  findAllAdministrators() {
    return this.usersService.findAllAdministrators();
  }

  @Get('students')
  findAllStudents(
    @Query('sede') headquarterId?: number,
    @Query('programId') programId?: number
  ) {
    return this.usersService.findAllStudents(headquarterId, programId);
  }

  @Get('students/:id')
  findOneStudents(@Param('id') id: number) {
    return this.usersService.findOneStudents(id);
  }

  @Get('/administrators/headquarters/:headquarterId')
  findAllAdministratorsByRole(
    @Param('headquarterId') headquarterId: number,
    @Query('administratorType') administratorType?: string
  ) {
    return this.usersService.findAllAdministratorsByRole(headquarterId, administratorType);
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

  @Delete('students/:id')
  removeStudent(@Param('id') id: number) {
    return this.usersService.removeStudent(id);
  }


  @Delete('administrators/:id')
  removeAdministrator(@Param('id') id: number) {
    return this.usersService.removeAdministrator(id);
  }

}