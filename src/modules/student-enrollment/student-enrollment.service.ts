import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentEnrollment } from './entities/student-enrollment.entity';
import { CreateStudentEnrollmentDto } from './dto/create-student-enrollment.dto';

@Injectable()
export class StudentEnrollmentService {
  constructor(
    @InjectRepository(StudentEnrollment)
    private readonly enrollmentRepository: Repository<StudentEnrollment>,
  ) {}

  async create(createEnrollmentDto: CreateStudentEnrollmentDto) {
    try {
      const enrollment = this.enrollmentRepository.create(createEnrollmentDto);
      const savedEnrollment = await this.enrollmentRepository.save(enrollment);

      return {
        success: true,
        message: 'Enrollment created successfully',
        data: savedEnrollment,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error creating enrollment: ${error.message}`,
        data: null,
      };
    }
  }

  async findAll() {
    try {
      const enrollments = await this.enrollmentRepository.find({
        relations: ['student', 'group', 'degree'],
      });
      return {
        success: true,
        message: 'Enrollments retrieved successfully',
        data: enrollments,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error retrieving enrollments: ${error.message}`,
        data: null,
      };
    }
  }

  // Add other CRUD methods as needed
}