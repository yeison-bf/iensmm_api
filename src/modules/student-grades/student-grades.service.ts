import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentGrade } from './entities/student-grade.entity';
import { CreateStudentGradeDto } from './dto/create-student-grade.dto';
import { UpdateStudentGradeDto } from './dto/update-student-grade.dto';
import { StudentEnrollment } from '../student-enrollment/entities/student-enrollment.entity';
import { AcademicThinkingDetail } from '../academic-thinking/entities/academic-thinking-detail.entity';
import { PeriodDetail } from '../period-details/entities/period-detail.entity';
import { Administrator } from '../administrators/entities/administrator.entity';

@Injectable()
export class StudentGradesService {
  constructor(

    @InjectRepository(StudentGrade)
    private readonly gradeRepository: Repository<StudentGrade>,
    @InjectRepository(StudentEnrollment)
    private readonly enrollmentRepository: Repository<StudentEnrollment>,
    @InjectRepository(AcademicThinkingDetail)
    private readonly thinkingDetailRepository: Repository<AcademicThinkingDetail>,
    @InjectRepository(PeriodDetail)
    private readonly periodDetailRepository: Repository<PeriodDetail>,
    @InjectRepository(Administrator)
    private readonly administratorRepository: Repository<Administrator>,

  ) { }

  async create(createGradeDto: CreateStudentGradeDto) {
    try {
      const results = await Promise.all(
        createGradeDto.grades.map(async (gradeDto) => {
          try {
            const [enrollment, thinkingDetail, periodDetail, teacher] = await Promise.all([
              this.enrollmentRepository.findOne({
                where: { id: gradeDto.studentEnrollmentId },
                relations: ['student', 'degree', 'group']
              }),
              this.thinkingDetailRepository.findOne({
                where: { id: gradeDto.academicThinkingDetailId }
              }),
              this.periodDetailRepository.findOne({
                where: { id: gradeDto.periodDetailId }
              }),
              this.administratorRepository.findOne({
                where: { id: gradeDto.teacherId }
              })
            ]);

            if (!enrollment || !thinkingDetail || !periodDetail || !teacher) {
              return {
                success: false,
                data: gradeDto,
                message: 'Una o más relaciones no encontradas',
                details: {
                  enrollment: !enrollment ? `ID ${gradeDto.studentEnrollmentId} no encontrado` : 'OK',
                  thinkingDetail: !thinkingDetail ? `ID ${gradeDto.academicThinkingDetailId} no encontrado` : 'OK',
                  periodDetail: !periodDetail ? `ID ${gradeDto.periodDetailId} no encontrado` : 'OK',
                  teacher: !teacher ? `ID ${gradeDto.teacherId} no encontrado` : 'OK'
                }
              };
            }

            const grade = this.gradeRepository.create({
              ...gradeDto,
              degreeId: enrollment.degree.id,
              groupId: enrollment.group.id,
              studentEnrollment: enrollment,
              academicThinkingDetail: thinkingDetail,
              periodDetail: periodDetail,
              teacher: teacher
            });

            const savedGrade = await this.gradeRepository.save(grade);
            
            const completeGrade = await this.gradeRepository.findOne({
              where: { id: savedGrade.id },
              relations: ['studentEnrollment', 'academicThinkingDetail', 'periodDetail', 'teacher']
            });

            return {
              success: true,
              data: completeGrade,
              message: 'Calificación creada exitosamente'
            };

          } catch (error) {
            console.error('Error processing grade:', error);
            return {
              success: false,
              data: gradeDto,
              message: `Error al procesar la calificación: ${error.message}`
            };
          }
        })
      );

      const successCount = results.filter(result => result.success).length;

      return {
        success: successCount > 0,
        message: `${successCount} de ${results.length} calificaciones creadas exitosamente`,
        data: {
          results,
          summary: {
            total: results.length,
            successful: successCount,
            failed: results.length - successCount
          }
        }
      };
    } catch (error) {
      console.error('Create grades error:', error);
      return {
        success: false,
        message: `Error al crear las calificaciones: ${error.message}`,
        data: null
      };
    }
  }

  async findAll(studentId?: number, periodId?: number, teacherId?: number, thinkingDetailId?: number) {
    try {
      const queryBuilder = this.gradeRepository
        .createQueryBuilder('grade')
        .leftJoinAndSelect('grade.studentEnrollment', 'enrollment')
        .leftJoinAndSelect('grade.academicThinkingDetail', 'thinkingDetail')
        .leftJoinAndSelect('grade.period', 'period')
        .leftJoinAndSelect('grade.teacher', 'teacher');

      if (studentId) {
        queryBuilder.andWhere('enrollment.studentId = :studentId', { studentId });
      }
      if (periodId) {
        queryBuilder.andWhere('grade.periodId = :periodId', { periodId });
      }
      if (teacherId) {
        queryBuilder.andWhere('grade.teacherId = :teacherId', { teacherId });
      }
      if (thinkingDetailId) {
        queryBuilder.andWhere('grade.academicThinkingDetailId = :thinkingDetailId', { thinkingDetailId });
      }

      const grades = await queryBuilder.getMany();

      return {
        success: true,
        message: 'Calificaciones recuperadas exitosamente',
        data: grades
      };
    } catch (error) {
      return {
        success: false,
        message: `Error al recuperar las calificaciones: ${error.message}`,
        data: null
      };
    }
  }

  async findOne(id: number) {
    try {
      const grade = await this.gradeRepository.findOne({
        where: { id },
        relations: ['studentEnrollment', 'academicThinkingDetail', 'period', 'teacher']
      });

      if (!grade) {
        return {
          success: false,
          message: `Calificación con ID ${id} no encontrada`,
          data: null
        };
      }

      return {
        success: true,
        message: 'Calificación recuperada exitosamente',
        data: grade
      };
    } catch (error) {
      return {
        success: false,
        message: `Error al recuperar la calificación: ${error.message}`,
        data: null
      };
    }
  }

  async update(id: number, updateGradeDto: UpdateStudentGradeDto) {
    try {
      const grade = await this.gradeRepository.findOne({
        where: { id },
        relations: ['studentEnrollment', 'academicThinkingDetail', 'period', 'teacher']
      });

      if (!grade) {
        return {
          success: false,
          message: `Calificación con ID ${id} no encontrada`,
          data: null
        };
      }

      Object.assign(grade, updateGradeDto);
      const updatedGrade = await this.gradeRepository.save(grade);

      return {
        success: true,
        message: 'Calificación actualizada exitosamente',
        data: updatedGrade
      };
    } catch (error) {
      return {
        success: false,
        message: `Error al actualizar la calificación: ${error.message}`,
        data: null
      };
    }
  }

  async remove(id: number) {
    try {
      const grade = await this.gradeRepository.findOne({
        where: { id }
      });

      if (!grade) {
        return {
          success: false,
          message: `Calificación con ID ${id} no encontrada`,
          data: null
        };
      }

      await this.gradeRepository.remove(grade);

      return {
        success: true,
        message: 'Calificación eliminada exitosamente',
        data: grade
      };
    } catch (error) {
      return {
        success: false,
        message: `Error al eliminar la calificación: ${error.message}`,
        data: null
      };
    }
  }
}