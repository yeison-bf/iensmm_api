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


}