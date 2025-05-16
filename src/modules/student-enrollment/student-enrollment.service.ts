import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentEnrollment } from './entities/student-enrollment.entity';
import { CreateStudentEnrollmentDto } from './dto/create-student-enrollment.dto';
import { Student } from '../students/entities/student.entity';
import { Group } from '../group/entities/group.entity';
import { Degree } from '../degrees/entities/degree.entity';

@Injectable()
export class StudentEnrollmentService {
  constructor(
    @InjectRepository(StudentEnrollment)
    private readonly enrollmentRepository: Repository<StudentEnrollment>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @InjectRepository(Degree)
    private readonly degreeRepository: Repository<Degree>,
  ) {}

    async create(createEnrollmentDto: CreateStudentEnrollmentDto) {
    try {
      // First verify if all related entities exist
      const student = await this.studentRepository.findOne({
        where: { id: createEnrollmentDto.studentId }
      });

      const group = await this.groupRepository.findOne({
        where: { id: createEnrollmentDto.groupId }
      });

      const degree = await this.degreeRepository.findOne({
        where: { id: createEnrollmentDto.degreeId }
      });

      if (!student || !group || !degree) {
        return {
          success: false,
          message: 'Student, Group or Degree not found',
          data: null,
        };
      }

      // Create enrollment with relations
      const enrollment = this.enrollmentRepository.create({
        schedule: createEnrollmentDto.schedule,
        folio: createEnrollmentDto.folio,
        registrationDate: createEnrollmentDto.registrationDate,
        type: createEnrollmentDto.type,
        observations: createEnrollmentDto.observations,
        student: student,
        group: group,
        degree: degree
      });

      const savedEnrollment = await this.enrollmentRepository.save(enrollment);

      // Fetch the complete enrollment with all relations
      const completeEnrollment = await this.enrollmentRepository.findOne({
        where: { id: savedEnrollment.id },
        relations: ['student', 'student.user', 'group', 'degree']
      });

      return {
        success: true,
        message: 'Enrollment created successfully',
        data: completeEnrollment,
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
        relations: [
          'student',
          'student.user',
          'group',
          'degree'
        ],
        order: {
          createdAt: 'DESC'
        }
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