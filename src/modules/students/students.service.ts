import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './entities/student.entity';
import { User } from '../users/entities/user.entity';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createStudentDto: CreateStudentDto) {
    try {
      const { userId, ...studentData } = createStudentDto;

      const user = await this.userRepository.findOne({
        where: { id: userId }
      });

      if (!user) {
        return {
          success: false,
          message: 'User not found',
          data: null,
        };
      }

      const student = this.studentRepository.create({
        ...studentData,
        user,
      });

      const savedStudent = await this.studentRepository.save(student);

      const completeStudent = await this.studentRepository.findOne({
        where: { id: savedStudent.id },
        relations: ['user'],
      });

      return {
        success: true,
        message: 'Student created successfully',
        data: completeStudent,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error creating student: ${error.message}`,
        data: null,
      };
    }
  }

  async findAll() {
    try {
      const students = await this.studentRepository.find({
        relations: ['user'],
      });

      return {
        success: true,
        message: 'Students retrieved successfully',
        data: students,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error retrieving students: ${error.message}`,
        data: null,
      };
    }
  }

  async findOne(id: number) {
    try {
      const student = await this.studentRepository.findOne({
        where: { id },
        relations: ['user'],
      });

      if (!student) {
        return {
          success: false,
          message: `Student with ID ${id} not found`,
          data: null,
        };
      }

      return {
        success: true,
        message: 'Student retrieved successfully',
        data: student,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error retrieving student: ${error.message}`,
        data: null,
      };
    }
  }


  async update(id: number, updateStudentDto: UpdateStudentDto) {
    try {
      const student = await this.studentRepository.findOne({
        where: { id },
        relations: ['user'],
      });

      if (!student) {
        return {
          success: false,
          message: `Student with ID ${id} not found`,
          data: null,
        };
      }

      const { userId, ...studentData } = updateStudentDto;

      if (userId) {
        const user = await this.userRepository.findOne({
          where: { id: userId }
        });
        if (!user) {
          return {
            success: false,
            message: 'User not found',
            data: null,
          };
        }
        student.user = user;
      }

      const updated = await this.studentRepository.save({
        ...student,
        ...studentData,
      });

      const completeStudent = await this.studentRepository.findOne({
        where: { id: updated.id },
        relations: ['user'],
      });

      return {
        success: true,
        message: 'Student updated successfully',
        data: completeStudent,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error updating student: ${error.message}`,
        data: null,
      };
    }
  }

  async remove(id: number) {
    try {
      const student = await this.studentRepository.findOne({
        where: { id },
        relations: ['user'],
      });

      if (!student) {
        return {
          success: false,
          message: `Student with ID ${id} not found`,
          data: null,
        };
      }

      await this.studentRepository.remove(student);

      return {
        success: true,
        message: 'Student deleted successfully',
        data: student,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error deleting student: ${error.message}`,
        data: null,
      };
    }
  }
}