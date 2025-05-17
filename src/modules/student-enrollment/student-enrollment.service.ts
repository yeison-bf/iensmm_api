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
  ) { }

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
        degree: degree,
        headquarterId: Number(createEnrollmentDto.headquarterId),    // Agregado
        institutionId: Number(createEnrollmentDto.institutionId)     // Agregado
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

  async update(id: number, updateEnrollmentDto: CreateStudentEnrollmentDto) {
    try {
      const enrollment = await this.enrollmentRepository.findOne({
        where: { id },
        relations: ['student', 'group', 'degree']
      });

      if (!enrollment) {
        return {
          success: false,
          message: 'Enrollment not found',
          data: null,
        };
      }

      // Verify if related entities exist if they are being updated
      if (updateEnrollmentDto.studentId) {
        const student = await this.studentRepository.findOne({
          where: { id: updateEnrollmentDto.studentId }
        });
        if (!student) {
          return {
            success: false,
            message: 'Student not found',
            data: null,
          };
        }
        enrollment.student = student;
      }

      if (updateEnrollmentDto.groupId) {
        const group = await this.groupRepository.findOne({
          where: { id: updateEnrollmentDto.groupId }
        });
        if (!group) {
          return {
            success: false,
            message: 'Group not found',
            data: null,
          };
        }
        enrollment.group = group;
      }

      if (updateEnrollmentDto.degreeId) {
        const degree = await this.degreeRepository.findOne({
          where: { id: updateEnrollmentDto.degreeId }
        });
        if (!degree) {
          return {
            success: false,
            message: 'Degree not found',
            data: null,
          };
        }
        enrollment.degree = degree;
      }

      // Update basic fields
      enrollment.schedule = updateEnrollmentDto.schedule ?? enrollment.schedule;
      enrollment.folio = updateEnrollmentDto.folio ?? enrollment.folio;
      enrollment.registrationDate = updateEnrollmentDto.registrationDate ?? enrollment.registrationDate;
      enrollment.type = updateEnrollmentDto.type ?? enrollment.type;
      enrollment.observations = updateEnrollmentDto.observations ?? enrollment.observations;

      const updatedEnrollment = await this.enrollmentRepository.save(enrollment);

      // Fetch complete updated data
      const completeEnrollment = await this.enrollmentRepository.findOne({
        where: { id: updatedEnrollment.id },
        relations: ['student', 'student.user', 'group', 'degree']
      });

      return {
        success: true,
        message: 'Enrollment updated successfully',
        data: completeEnrollment,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error updating enrollment: ${error.message}`,
        data: null,
      };
    }
  }

  async remove(id: number) {
    try {
      const enrollment = await this.enrollmentRepository.findOne({
        where: { id },
        relations: ['student', 'student.user', 'group', 'degree']
      });

      if (!enrollment) {
        return {
          success: false,
          message: 'Enrollment not found',
          data: null,
        };
      }

      await this.enrollmentRepository.remove(enrollment);

      return {
        success: true,
        message: 'Enrollment deleted successfully',
        data: enrollment,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error deleting enrollment: ${error.message}`,
        data: null,
      };
    }
  }
}