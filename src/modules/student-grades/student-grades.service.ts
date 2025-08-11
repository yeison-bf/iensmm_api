import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentGrade } from './entities/student-grade.entity';
import { CreateStudentGradeDto } from './dto/create-student-grade.dto';
import { StudentEnrollment } from '../student-enrollment/entities/student-enrollment.entity';
import { AcademicThinkingDetail } from '../academic-thinking/entities/academic-thinking-detail.entity';
import { PeriodDetail } from '../period-details/entities/period-detail.entity';
import { Administrator } from '../administrators/entities/administrator.entity';
import { UpdateStudentGradesBulkDto } from './dto/update-student-grade.dto';
import { Degree } from '../degrees/entities/degree.entity';
import { Group } from '../group/entities/group.entity';
import { MailService } from 'src/mail/mail.service';
import * as pdfParse from 'pdf-parse';



export interface StudentData {
  nombre: string;
  grupo: string;
  codigo: string;
  asignaturas: Array<{
    numero: number;
    nombre: string;
    intensidad_horaria: number;
    nota: number;
    desempeño: string;
  }>;
  estado: string; // APROBADO, APLAZADO
  areas_recuperar?: Array<{
    asignatura: string;
    nota: number;
    nivel_requerido: number;
    fecha: string;
  }>;
}


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
    @InjectRepository(Degree)
    private degreeRepository: Repository<Degree>,

    @InjectRepository(Group)
    private groupRepository: Repository<Group>,

    private readonly mailService: MailService
  ) { }




  async notificarUsuario(email: string, nombre: string) {
    const contenido = `
      <h1>Hola ${nombre}</h1>
      <p>Tu registro ha sido exitoso. ¡Gracias por participar!</p>
    `;

    await this.mailService.sendMail(email, 'Registro confirmado', contenido);
  }

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
              degreeId: gradeDto.degreeId,
              groupId: gradeDto.groupId,
              studentEnrollment: enrollment,
              academicThinkingDetail: thinkingDetail,
              periodDetail: periodDetail,
              teacher: teacher,
              closingDate: gradeDto.closingDate
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

  async update(id: number, updateGradeDto: UpdateStudentGradesBulkDto) {
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

  async findByStudentCertificate(studentEnrollmentId?: number, periodDetailId?: number) {
    try {
      const queryBuilder = this.gradeRepository
        .createQueryBuilder('grade')
        .leftJoinAndSelect('grade.studentEnrollment', 'enrollment')
        .leftJoinAndSelect('grade.academicThinkingDetail', 'thinkingDetail')
        .leftJoinAndSelect('thinkingDetail.trainingArea', 'trainingArea')
      // .leftJoinAndSelect('grade.period', 'period')
      // .leftJoinAndSelect('grade.teacher', 'teacher');

      if (studentEnrollmentId) {
        queryBuilder.andWhere('grade.studentEnrollmentId = :studentEnrollmentId', { studentEnrollmentId });
      }
      if (periodDetailId) {
        queryBuilder.andWhere('grade.periodDetailId = :periodDetailId', { periodDetailId });
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

  async findByFilters(groupId?: number, degreeId?: number, thinkingDetailId?: number, periodDetailId?: number) {
    try {
      const queryBuilder = this.gradeRepository
        .createQueryBuilder('grade')
        .leftJoinAndSelect('grade.studentEnrollment', 'enrollment')
        .leftJoinAndSelect('enrollment.student', 'student')
        .leftJoinAndSelect('grade.academicThinkingDetail', 'thinkingDetail')
        .leftJoinAndSelect('grade.periodDetail', 'periodDetail')
        .leftJoinAndSelect('grade.teacher', 'teacher')
        .leftJoinAndSelect('thinkingDetail.academicThinking', 'thinking');

      if (groupId) {
        queryBuilder.andWhere('grade.groupId = :groupId', { groupId });
      }
      if (degreeId) {
        queryBuilder.andWhere('grade.degreeId = :degreeId', { degreeId });
      }
      if (thinkingDetailId) {
        queryBuilder.andWhere('grade.academicThinkingDetailId = :thinkingDetailId', { thinkingDetailId });
      }
      if (periodDetailId) {
        queryBuilder.andWhere('grade.periodDetailId = :periodDetailId', { periodDetailId });
      }

      // Order by enrollment ID instead of student name
      queryBuilder.orderBy('enrollment.id', 'ASC');

      const grades = await queryBuilder.getMany();

      return {
        success: true,
        message: 'Calificaciones recuperadas exitosamente',
        data: grades
      };
    } catch (error) {
      console.error('Find by filters error:', error);
      return {
        success: false,
        message: `Error al recuperar las calificaciones: ${error.message}`,
        data: null
      };
    }
  }

  async findByFiltersTrainignArea(groupId?: number, degreeId?: number, periodDetailId?: number) {
    try {
      const queryBuilder = this.gradeRepository
        .createQueryBuilder('grade')
        .leftJoinAndSelect('grade.academicThinkingDetail', 'thinkingDetail')
        .leftJoinAndSelect('thinkingDetail.trainingArea', 'trainingArea');

      if (groupId) {
        queryBuilder.andWhere('grade.groupId = :groupId', { groupId });
      }

      if (degreeId) {
        queryBuilder.andWhere('grade.degreeId = :degreeId', { degreeId });
      }

      if (periodDetailId) {
        queryBuilder.andWhere('grade.periodDetailId = :periodDetailId', { periodDetailId });
      }

      queryBuilder.orderBy('trainingArea.name', 'ASC');

      const grades = await queryBuilder.getMany();

      // Agrupar manualmente por área de formación
      const grouped = grades.reduce((acc, grade) => {
        const areaName = grade.academicThinkingDetail?.trainingArea?.name || 'Área desconocida';

        if (!acc[areaName]) {
          acc[areaName] = [];
        }

        acc[areaName].push(grade);
        return acc;
      }, {} as Record<string, any[]>);

      return {
        success: true,
        message: 'Calificaciones agrupadas exitosamente por área de formación',
        data: grouped
      };

    } catch (error) {
      console.error('Error en findByFiltersTrainignArea:', error);
      return {
        success: false,
        message: `Error al recuperar las calificaciones: ${error.message}`,
        data: null
      };
    }
  }

  async findByFiltersVoletin(groupId?: number, degreeId?: number, thinkingDetailId?: number, periodDetailId?: number) {
    try {
      const queryBuilder = this.gradeRepository
        .createQueryBuilder('grade')
        .leftJoinAndSelect('grade.studentEnrollment', 'enrollment')
        .leftJoinAndSelect('enrollment.student', 'student')
        .leftJoinAndSelect('student.user', 'user')
        .leftJoinAndSelect('grade.academicThinkingDetail', 'thinkingDetail')
        .leftJoinAndSelect('grade.periodDetail', 'periodDetail')
        .leftJoinAndSelect('grade.teacher', 'teacher')
        .leftJoinAndSelect('thinkingDetail.academicThinking', 'thinking');

      if (groupId) {
        queryBuilder.andWhere('grade.groupId = :groupId', { groupId });
      }
      if (degreeId) {
        queryBuilder.andWhere('grade.degreeId = :degreeId', { degreeId });
      }
      if (thinkingDetailId) {
        queryBuilder.andWhere('grade.academicThinkingDetailId = :thinkingDetailId', { thinkingDetailId });
      }
      if (periodDetailId) {
        queryBuilder.andWhere('grade.periodDetailId = :periodDetailId', { periodDetailId });
      }

      // Order by enrollment ID instead of student name
      queryBuilder.orderBy('enrollment.id', 'ASC');

      const grades = await queryBuilder.getMany();

      return {
        success: true,
        message: 'Calificaciones recuperadas exitosamente',
        data: grades
      };
    } catch (error) {
      console.error('Find by filters error:', error);
      return {
        success: false,
        message: `Error al recuperar las calificaciones: ${error.message}`,
        data: null
      };
    }
  }

  async findByFiltersLeveling(
    groupId?: number,
    degreeId?: number,
    thinkingDetailId?: number,
    periodDetailId?: number,
    onlyLowGrades: boolean = true // Nuevo parámetro opcional
  ) {
    try {
      const queryBuilder = this.gradeRepository
        .createQueryBuilder('grade')
        .leftJoinAndSelect('grade.studentEnrollment', 'enrollment')
        .leftJoinAndSelect('enrollment.student', 'student')
        .leftJoinAndSelect('grade.academicThinkingDetail', 'thinkingDetail')
        .leftJoinAndSelect('grade.periodDetail', 'periodDetail')
        .leftJoinAndSelect('grade.teacher', 'teacher')
        .leftJoinAndSelect('thinkingDetail.academicThinking', 'thinking');

      if (groupId) {
        queryBuilder.andWhere('grade.groupId = :groupId', { groupId });
      }
      if (degreeId) {
        queryBuilder.andWhere('grade.degreeId = :degreeId', { degreeId });
      }
      if (thinkingDetailId) {
        queryBuilder.andWhere('grade.academicThinkingDetailId = :thinkingDetailId', { thinkingDetailId });
      }
      if (periodDetailId) {
        queryBuilder.andWhere('grade.periodDetailId = :periodDetailId', { periodDetailId });
      }
      if (onlyLowGrades) {
        queryBuilder.andWhere('grade.qualitativeGrade = :qualitativeGrade', { qualitativeGrade: 'bajo' });
      }

      // Order by enrollment ID instead of student name
      queryBuilder.orderBy('enrollment.id', 'ASC');

      const grades = await queryBuilder.getMany();

      return {
        success: true,
        message: 'Calificaciones recuperadas exitosamente',
        data: grades
      };
    } catch (error) {
      console.error('Find by filters error:', error);
      return {
        success: false,
        message: `Error al recuperar las calificaciones: ${error.message}`,
        data: null
      };
    }
  }

  async findByFiltersLevelingList(
    groupId?: number,
    degreeId?: number,
    thinkingDetailId?: number,
    periodDetailId?: number,
    onlyLowGrades: boolean = true
  ) {
    try {
      // Consulta principal (solo IDs)
      const queryBuilder = this.gradeRepository
        .createQueryBuilder('grade')
        .leftJoinAndSelect('grade.academicThinkingDetail', 'thinkingDetail')
        .leftJoinAndSelect('thinkingDetail.academicThinking', 'thinking');
      // Filtros
      if (groupId) queryBuilder.andWhere('grade.groupId = :groupId', { groupId });
      if (degreeId) queryBuilder.andWhere('grade.degreeId = :degreeId', { degreeId });
      if (thinkingDetailId) queryBuilder.andWhere('grade.academicThinkingDetailId = :thinkingDetailId', { thinkingDetailId });
      if (periodDetailId) queryBuilder.andWhere('grade.periodDetailId = :periodDetailId', { periodDetailId });

      // CORRECCIÓN: Verificar que onlyLowGrades sea true Y usar el valor correcto
      if (onlyLowGrades === true) {
        // Opción 1: Si "Bajo" es el valor correcto (con mayúscula)
        // queryBuilder.andWhere('grade.qualitativeGrade = :qualitativeGrade', { qualitativeGrade: 'Bajo' });

        // Opción 2: Si quieres hacer una búsqueda insensible a mayúsculas/minúsculas
        queryBuilder.andWhere('LOWER(grade.qualitativeGrade) = LOWER(:qualitativeGrade)', { qualitativeGrade: 'bajo' });

        // Opción 3: Si quieres múltiples valores que consideres "bajos"
        // queryBuilder.andWhere('grade.qualitativeGrade IN (:...lowGrades)', { lowGrades: ['Bajo', 'bajo', 'Deficiente'] });
      }

      const grades = await queryBuilder.getMany();

      // Si onlyLowGrades es true y no hay resultados, retornar vacío
      if (onlyLowGrades === true && grades.length === 0) {
        return {
          success: true,
          message: 'No se encontraron calificaciones bajas con los filtros aplicados',
          data: [],
        };
      }

      // Obtener IDs únicos de degrees y groups
      const degreeIds = [...new Set(grades.map(g => g.degreeId))];
      const groupIds = [...new Set(grades.map(g => g.groupId))];

      // Consultar nombres (si hay registros)
      let degreesMap = {};
      let groupsMap = {};

      if (degreeIds.length > 0) {
        const degrees = await this.degreeRepository.findByIds(degreeIds);
        degreesMap = degrees.reduce((acc, d) => ({ ...acc, [d.id]: d }), {});
      }

      if (groupIds.length > 0) {
        const groups = await this.groupRepository.findByIds(groupIds);
        groupsMap = groups.reduce((acc, g) => ({ ...acc, [g.id]: g }), {});
      }

      // Agrupar por degreeId + groupId
      const grouped = grades.reduce((acc, grade) => {
        const key = `${grade.degreeId}-${grade.groupId}`;

        if (!acc[key]) {
          acc[key] = {
            degree: degreesMap[grade.degreeId] || { id: grade.degreeId },
            group: groupsMap[grade.groupId] || { id: grade.groupId },
            grades: [],
          };
        }

        acc[key].grades.push(grade);
        return acc;
      }, {});

      return {
        success: true,
        message: onlyLowGrades ? 'Calificaciones bajas agrupadas exitosamente' : 'Calificaciones agrupadas exitosamente',
        data: Object.values(grouped),
      };

    } catch (error) {
      console.error('Error:', error);
      return {
        success: false,
        message: `Error: ${error.message}`,
        data: null,
      };
    }
  }

  async findByTeacherAndYear(
    teacherId: number,
    year: number,
    onlyLowGrades: boolean = true
  ) {
    try {
      if (!year) {
        throw new Error('El año es requerido');
      }

      const queryBuilder = this.gradeRepository
        .createQueryBuilder('grade')
        .leftJoinAndSelect('grade.studentEnrollment', 'enrollment')
        .leftJoinAndSelect('enrollment.student', 'student')
        .leftJoinAndSelect('grade.academicThinkingDetail', 'thinkingDetail')
        .leftJoinAndSelect('thinkingDetail.trainingArea', 'trainingArea')
        .leftJoinAndSelect('thinkingDetail.academicThinking', 'thinking')
        .leftJoinAndSelect('grade.periodDetail', 'periodDetail')
        .where('EXTRACT(YEAR FROM grade.createdAt) = :year', { year })
        .andWhere('grade.status = :status', { status: 1 });

      if (teacherId) {
        queryBuilder.andWhere('grade.teacherId = :teacherId', { teacherId });
      }

      if (onlyLowGrades) {
        queryBuilder.andWhere(
          `LOWER(TRIM(grade.qualitativeGrade)) = LOWER(:grade)`,
          { grade: 'bajo' }
        );
      }

      const grades = await queryBuilder.getMany();

      const degreeIds = [...new Set(grades.map(g =>
        g.degreeId || g.academicThinkingDetail?.academicThinking?.gradeId
      ).filter(Boolean))];

      const groupIds = [...new Set(grades.map(g => g.groupId).filter(Boolean))];

      const [degrees, groups] = await Promise.all([
        degreeIds.length > 0 ? this.degreeRepository.findByIds(degreeIds) : Promise.resolve([]),
        groupIds.length > 0 ? this.groupRepository.findByIds(groupIds) : Promise.resolve([])
      ]);

      const degreeMap = degrees.reduce((acc, curr) => ({ ...acc, [curr.id]: curr }), {});
      const groupMap = groups.reduce((acc, curr) => ({ ...acc, [curr.id]: curr }), {});

      const result = grades.reduce((acc, grade) => {
        const periodDetailId = grade.periodDetailId;
        const degreeId = grade.degreeId ?? grade.academicThinkingDetail?.academicThinking?.gradeId;
        const groupId = grade.groupId;
        const trainingAreaId = grade.academicThinkingDetail?.trainingArea?.id;

        if (!periodDetailId || !degreeId || !groupId || !trainingAreaId) {
          console.warn('Grade con datos faltantes:', grade.id);
          return acc;
        }

        const periodKey = `${periodDetailId}`;
        const groupKey = `${degreeId}-${groupId}`;
        const areaKey = `${trainingAreaId}`;

        if (!acc[periodKey]) {
          acc[periodKey] = {
            periodDetail: grade.periodDetail || { id: periodDetailId, name: 'No disponible' },
            groups: {}
          };
        }

        if (!acc[periodKey].groups[groupKey]) {
          acc[periodKey].groups[groupKey] = {
            degree: degreeMap[degreeId] || { id: degreeId, name: 'No disponible' },
            group: groupMap[groupId] || { id: groupId, name: 'No disponible' },
            trainingAreas: {}
          };
        }

        if (!acc[periodKey].groups[groupKey].trainingAreas[areaKey]) {
          acc[periodKey].groups[groupKey].trainingAreas[areaKey] = {
            trainingArea: {
              ...(grade.academicThinkingDetail?.trainingArea ?? {}),
              academicThinkingDetail: grade.academicThinkingDetail ?? null
            },
            grades: []
          };
        }

        acc[periodKey].groups[groupKey].trainingAreas[areaKey].grades.push({
          id: grade.id,
          student: grade.studentEnrollment?.student ?? null,
          headquarterId: grade.studentEnrollment?.headquarterId ?? null,
          numericalGrade: grade.numericalGrade,
          qualitativeGrade: grade.qualitativeGrade,
          disciplineGrade: grade.disciplineGrade,
          observations: grade.observations,
          closingDate: grade.closingDate,
          createdAt: grade.createdAt
        });

        return acc;
      }, {} as Record<string, {
        periodDetail: { id: number; name: string };
        groups: Record<string, {
          degree: any;
          group: any;
          trainingAreas: Record<string, {
            trainingArea: any;
            grades: Array<{
              id: number;
              student: any;
              headquarterId: any;
              numericalGrade: number;
              qualitativeGrade: string;
              disciplineGrade?: number;
              observations?: string;
              closingDate?: Date;
              createdAt?: Date;
            }>;
          }>;
        }>;
      }>);

      const formattedResult = Object.values(result).map(period => ({
        periodDetail: period.periodDetail,
        groups: Object.values(period.groups).map(group => ({
          degree: group.degree,
          group: group.group,
          trainingAreas: Object.values(group.trainingAreas)
        }))
      }));

      return {
        success: true,
        message: onlyLowGrades
          ? 'Calificaciones bajas agrupadas por período, grupo y área exitosamente'
          : 'Todas las calificaciones agrupadas por período, grupo y área exitosamente',
        data: formattedResult
      };

    } catch (error) {
      console.error('Error en findByTeacherAndYear:', error);
      return {
        success: false,
        message: `Error al obtener calificaciones: ${error.message}`,
        data: null
      };
    }
  }

  async checkAllGradesStatusByStudentAndPeriod(
    studentId: number,
    periodId: number,
  ): Promise<boolean> {
    try {
      const grades = await this.gradeRepository.find({
        where: { studentEnrollmentId: studentId, periodDetailId: periodId, status: true }
      })
      console.log(grades)
      // Si no encuentra ninguna nota con status false, significa que todas están en true
      return grades.length > 0 ? true : false;
    } catch (error) {
      throw new Error(`Error al verificar estado de notas: ${error.message}`);
    }
  }

  async findByEnrollmentAndPeriod(studentEnrollmentId: number, periodId: number) {
    try {
      const grades = await this.gradeRepository
        .createQueryBuilder('grade')
        .leftJoinAndSelect('grade.academicThinkingDetail', 'academicThinkingDetail')
        .leftJoinAndSelect('academicThinkingDetail.trainingArea', 'trainingArea')
        .leftJoinAndSelect('grade.periodDetail', 'periodDetail')
        .leftJoinAndSelect('grade.studentEnrollment', 'studentEnrollment')
        .leftJoin('studentEnrollment.student', 'student')
        .leftJoin('student.user', 'studentUser')
        .leftJoinAndSelect('grade.teacher', 'teacher') // Relación con Administrator
        .leftJoin('teacher.user', 'teacherUser') // Para obtener datos del usuario del teacher
        .addSelect([
          'student.id',
          'studentUser.firstName',
          'studentUser.lastName',
          'teacherUser.firstName',
          'teacherUser.lastName',
          'teacher.academicTitle',
          'teacher.trainingArea'
        ])
        .where('grade.studentEnrollmentId = :studentEnrollmentId', { studentEnrollmentId })
        .andWhere('grade.periodDetailId = :periodId', { periodId })
        .orderBy('grade.createdAt', 'DESC')
        .getMany();

      if (!grades.length) {
        return {
          success: false,
          message: 'No se encontraron calificaciones para esta matrícula y período',
          data: null,
        };
      }

      // Formatear los datos para la respuesta
      const formattedGrades = grades.map(grade => ({
        id: grade.id,
        numericalGrade: grade.numericalGrade,
        qualitativeGrade: grade.qualitativeGrade,
        disciplineGrade: grade.disciplineGrade,
        observations: grade.observations,
        closingDate: grade.closingDate,
        status: grade.status,
        academicThinkingDetail: {
          id: grade.academicThinkingDetail.id,
          name: grade.academicThinkingDetail.trainingArea.name,
          hourlyIntensity: grade.academicThinkingDetail.hourlyIntensity,
          percentage: grade.academicThinkingDetail.percentage
        },
        periodDetail: {
          id: grade.periodDetail.id,
          name: grade.periodDetail.name,
          code: grade.periodDetail.code,
          startDate: grade.periodDetail.startDate,
          endDate: grade.periodDetail.endDate
        },
        teacher: grade.teacher ? {
          id: grade.teacher.id,
          firstName: grade.teacher.user?.firstName,
          lastName: grade.teacher.user?.lastName,
          academicTitle: grade.teacher.academicTitle,
          trainingArea: grade.teacher.trainingArea,
          signature: grade.teacher.signature
        } : null,
        student: {
          id: grade.studentEnrollment.student?.id,
          firstName: grade.studentEnrollment.student?.user?.firstName,
          lastName: grade.studentEnrollment.student?.user?.lastName
        }
      }));

      return {
        success: true,
        message: 'Calificaciones obtenidas exitosamente',
        data: formattedGrades,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error al obtener calificaciones: ${error.message}`,
        data: null,
      };
    }
  }

  // Listar promedios por peeridos
  async getGradeAveragesByPeriod(enrollmentId: number, periodId: number) {
    try {
      // 1. Obtener información del período específico
      const periodInfo = await this.gradeRepository
        .createQueryBuilder('grade')
        .leftJoinAndSelect('grade.periodDetail', 'periodDetail')
        .select([
          'periodDetail.id as id',
          'periodDetail.name as name',
          'periodDetail.code as code',
          'periodDetail.startDate as startDate',
          'periodDetail.endDate as endDate'
        ])
        .where('grade.studentEnrollmentId = :enrollmentId', { enrollmentId })
        .andWhere('grade.periodDetailId = :periodId', { periodId })
        .limit(1)
        .getRawOne();

      if (!periodInfo) {
        return {
          success: false,
          message: 'No se encontró el período especificado',
          data: [],
        };
      }

      // 2. Calcular promedios para el período
      const averages = await this.gradeRepository
        .createQueryBuilder('grade')
        .select([
          'COUNT(grade.id) as totalGrades',
          'AVG(grade.numericalGrade) as averageGrade',
          'AVG(grade.disciplineGrade) as averageDiscipline'
        ])
        .where('grade.studentEnrollmentId = :enrollmentId', { enrollmentId })
        .andWhere('grade.periodDetailId = :periodId', { periodId })
        .getRawOne();

      // 3. Formatear respuesta como ARREGLO
      const result = [
        {
          period: {
            id: periodInfo.id,
            name: periodInfo.name,
            code: periodInfo.code,
            startDate: periodInfo.startDate,
            endDate: periodInfo.endDate
          },
          statistics: {
            totalGrades: parseInt(averages.totalGrades),
            averageGrade: parseFloat(averages.averageGrade),
            averageDiscipline: parseFloat(averages.averageDiscipline)
          }
        }
      ];

      return {
        success: true,
        message: 'Promedios del período obtenidos exitosamente',
        data: result // Siempre devuelve un arreglo
      };

    } catch (error) {
      return {
        success: false,
        message: `Error al calcular promedios: ${error.message}`,
        data: [], // Devuelve arreglo vacío en caso de error
      };
    }
  }

  async getGradesGroupedForChart(studentEnrollmentId: number, periodDetailId: number) {
    try {
      const grades = await this.gradeRepository
        .createQueryBuilder('grade')
        .leftJoinAndSelect('grade.academicThinkingDetail', 'academicThinkingDetail')
        .leftJoinAndSelect('academicThinkingDetail.trainingArea', 'trainingArea')
        .leftJoinAndSelect('academicThinkingDetail.academicThinking', 'academicThinking')
        .where('grade.studentEnrollmentId = :studentEnrollmentId', { studentEnrollmentId })
        .andWhere('grade.periodDetailId = :periodDetailId', { periodDetailId })
        .getMany();

      if (!grades.length) {
        return {
          success: false,
          message: 'No se encontraron calificaciones para esta matrícula y período',
          data: null,
        };
      }

      // Agrupar por academicThinking.id y luego por trainingArea.id
      const grouped: Record<number, {
        academicThinking: { id: number; year: number };
        trainingAreas: Record<number, {
          trainingArea: { id: number; name: string };
          grades: Array<{ id: number; numericalGrade: number; qualitativeGrade: string; status: boolean }>;
        }>;
      }> = {};

      grades.forEach(grade => {
        const academicThinking = grade.academicThinkingDetail.academicThinking;
        const trainingArea = grade.academicThinkingDetail.trainingArea;

        const thinkingId = academicThinking.id;
        const areaId = trainingArea.id;

        if (!grouped[thinkingId]) {
          grouped[thinkingId] = {
            academicThinking: {
              id: thinkingId,
              year: academicThinking.year,
            },
            trainingAreas: {}
          };
        }

        if (!grouped[thinkingId].trainingAreas[areaId]) {
          grouped[thinkingId].trainingAreas[areaId] = {
            trainingArea: {
              id: areaId,
              name: trainingArea.name
            },
            grades: []
          };
        }

        grouped[thinkingId].trainingAreas[areaId].grades.push({
          id: grade.id,
          numericalGrade: grade.numericalGrade,
          qualitativeGrade: grade.qualitativeGrade,
          status: grade.status
        });
      });

      const formattedResult = Object.values(grouped).map(thinking => ({
        academicThinking: thinking.academicThinking,
        trainingAreas: Object.values(thinking.trainingAreas)
      }));

      return {
        success: true,
        message: 'Calificaciones agrupadas para gráfico obtenidas exitosamente',
        data: formattedResult
      };
    } catch (error) {
      return {
        success: false,
        message: `Error al obtener datos para gráfico: ${error.message}`,
        data: null
      };
    }
  }

  // MÉTODO CORREGIDO
  async updateBulk(updateGradesDto: UpdateStudentGradesBulkDto) {
    console.log("---- aqui ... ")
    const results = {
      success: true,
      message: '',
      data: {
        updated: [],
        errors: [],
        totalProcessed: updateGradesDto.grades.length
      }
    };

    try {
      // Procesar cada calificación individualmente usando Promise.all como en create
      const updateResults = await Promise.all(
        updateGradesDto.grades.map(async (gradeUpdate) => {
          try {
            const { id, ...updateData } = gradeUpdate;

            // Buscar el registro existente SIN relaciones (igual que en create)
            const existingGrade = await this.gradeRepository.findOne({
              where: { id }
            });

            if (!existingGrade) {
              return {
                success: false,
                id,
                message: `Calificación con ID ${id} no encontrada`
              };
            }

            // Limpiar campos undefined o vacíos
            const cleanUpdateData = {};
            Object.keys(updateData).forEach(key => {
              if (updateData[key] !== undefined && updateData[key] !== '') {
                cleanUpdateData[key] = updateData[key];
              }
            });

            // Actualizar usando el método update (más eficiente)
            await this.gradeRepository.update(id, cleanUpdateData);

            // Obtener el registro actualizado (opcional, solo si necesitas devolverlo)
            const updatedGrade = await this.gradeRepository.findOne({
              where: { id }
            });

            return {
              success: true,
              id,
              message: 'Actualizado exitosamente',
              data: updatedGrade
            };

          } catch (error) {
            console.error('Error updating grade:', error);
            return {
              success: false,
              id: gradeUpdate.id,
              message: `Error al actualizar: ${error.message}`
            };
          }
        })
      );

      // Procesar resultados
      updateResults.forEach(result => {
        if (result.success) {
          results.data.updated.push({
            id: result.id,
            message: result.message,
            data: result.data
          });
        } else {
          results.data.errors.push({
            id: result.id,
            message: result.message
          });
        }
      });

      // Determinar el mensaje final
      const updatedCount = results.data.updated.length;
      const errorCount = results.data.errors.length;

      if (errorCount === 0) {
        results.message = `Todas las ${updatedCount} calificaciones fueron actualizadas exitosamente`;
      } else if (updatedCount === 0) {
        results.success = false;
        results.message = `No se pudo actualizar ninguna calificación. ${errorCount} errores encontrados`;
      } else {
        results.message = `${updatedCount} calificaciones actualizadas exitosamente, ${errorCount} con errores`;
      }

      return results;

    } catch (error) {
      console.error('Update bulk error:', error);
      return {
        success: false,
        message: `Error general en la actualización masiva: ${error.message}`,
        data: null
      };
    }
  }



































  // Método para agregar a tu servicio existente
async extractDataFromPdf(pdfBuffer: Buffer): Promise<StudentData[]> {
  console.log("Si entra al pdf ")
  try {
    // Parsear el PDF
    const pdfData = await pdfParse(pdfBuffer);
    const text = pdfData.text;
    
    // Dividir el texto en secciones (páginas o bloques de estudiante)
    const sections = this.splitIntoSections(text);
    
    // Extraer datos de cada sección
    const extractedData: StudentData[] = [];
    
    for (const section of sections) {
      const data = this.extractDataFromSection(section);
      if (data) {
        extractedData.push(data);
      }
    }
    
    return this.validateAndCleanData(extractedData);
    
  } catch (error) {
    throw new Error(`Error procesando PDF: ${error.message}`);
  }
}

private splitIntoSections(text: string): string[] {
  // Dividir por nombre de estudiante (cada línea que tiene nombres completos en mayúsculas)
  const lines = text.split('\n');
  const sections = [];
  let currentSection = '';
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Buscar líneas que parecen nombres de estudiantes (todas mayúsculas, más de 10 caracteres)
    if (line.length > 10 && /^[A-ZÁÉÍÓÚÑ\s]+$/.test(line) && line.includes(' ') && !line.includes('NORMAL') && !line.includes('MARIA')) {
      // Si ya tenemos una sección, guardarla
      if (currentSection.length > 100) {
        sections.push(currentSection);
      }
      // Iniciar nueva sección con este nombre
      currentSection = line + '\n';
    } else {
      currentSection += line + '\n';
    }
  }
  
  // Agregar la última sección
  if (currentSection.length > 100) {
    sections.push(currentSection);
  }
  
  return sections;
}

private extractDataFromSection(section: string): StudentData | null {
  try {
    const lines = section.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    // Buscar nombre (primera línea que parece un nombre)
    let nombre = '';
    for (const line of lines) {
      if (line.length > 10 && /^[A-ZÁÉÍÓÚÑ\s]+$/.test(line) && line.includes(' ') && !line.includes('NORMAL')) {
        nombre = line;
        break;
      }
    }
    
    if (!nombre) return null;
    
    // Buscar código - línea que contiene "Codigo" seguido de números
    let codigo = '';
    for (const line of lines) {
      const codigoMatch = line.match(/Codigo\s+(\d+)/);
      if (codigoMatch) {
        codigo = codigoMatch[1];
        break;
      }
    }
    
    // Buscar grupo - línea que contiene "Grupo:"
    let grupo = '';
    for (const line of lines) {
      const grupoMatch = line.match(/Grupo:\s*(\w+)/);
      if (grupoMatch) {
        grupo = grupoMatch[1];
        break;
      }
    }
    
    // Extraer asignaturas - buscar líneas que empiecen con número y tengan nota al final
    const asignaturas = [];
    for (const line of lines) {
      // Patrón: número + texto + número decimal al final
      const match = line.match(/^(\d+)\s+(\d+)\s*([A-ZÁÉÍÓÚÑ\s&]+?)\s+([\d.]+)$/);
      if (match) {
        const desempeñoLine = lines[lines.indexOf(line) - 1] || '';
        asignaturas.push({
          numero: parseInt(match[1]),
          intensidad_horaria: parseInt(match[2]),
          nombre: match[3].trim(),
          nota: parseFloat(match[4]),
          desempeño: desempeñoLine.includes('Desempeño') ? desempeñoLine.trim() : 'Desempeño'
        });
      }
    }
    
    // Buscar estado
    let estado = 'DESCONOCIDO';
    const sectionText = section.toLowerCase();
    if (sectionText.includes('aprobado')) estado = 'APROBADO';
    if (sectionText.includes('aplazado')) estado = 'APLAZADO';
    
    // Buscar áreas a recuperar
    const areas_recuperar = [];
    for (const line of lines) {
      const recuperarMatch = line.match(/([A-ZÁÉÍÓÚÑ\s]+)\s+([\d.]+)\s+NIV\(([\d.]+)\)\s+([\d-]+)/);
      if (recuperarMatch) {
        areas_recuperar.push({
          asignatura: recuperarMatch[1].trim(),
          nota: parseFloat(recuperarMatch[2]),
          nivel_requerido: parseFloat(recuperarMatch[3]),
          fecha: recuperarMatch[4]
        });
      }
    }
    
    if (asignaturas.length === 0) return null;
    
    return {
      nombre,
      grupo,
      codigo,
      asignaturas,
      estado,
      areas_recuperar: areas_recuperar.length > 0 ? areas_recuperar : undefined
    };
    
  } catch (error) {
    console.error('Error extrayendo datos de sección:', error);
    return null;
  }
}

private cleanName(name: string): string {
  return name
    .replace(/\s+/g, ' ')
    .replace(/[^\w\sÀ-ÿ]/g, '')
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, l => l.toUpperCase());
}

private validateAndCleanData(data: StudentData[]): StudentData[] {
  return data.filter(item => {
    if (!item.nombre || !item.codigo) return false;
    if (!item.asignaturas || item.asignaturas.length === 0) return false;
    
    // Limpiar nombre
    item.nombre = this.cleanName(item.nombre);
    
    // Validar notas
    item.asignaturas = item.asignaturas.filter(asig => 
      asig.nota >= 0 && asig.nota <= 5 && asig.nombre.length > 0
    );
    
    return item.asignaturas.length > 0;
  });
}




}