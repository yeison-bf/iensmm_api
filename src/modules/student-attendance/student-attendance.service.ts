import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { StudentAttendance } from './entities/student-attendance.entity';
import { CreateStudentAttendanceDto } from './dto/create-student-attendance.dto';
import { UpdateStudentAttendanceDto } from './dto/update-student-attendance.dto';
import { FindAttendanceDto } from './dto/find-attendance.dto';
import { MailService } from 'src/mail/mail.service';
import { Student } from '../students/entities/student.entity';

@Injectable()
export class StudentAttendanceService {
  constructor(
    @InjectRepository(StudentAttendance)
    private readonly attendanceRepository: Repository<StudentAttendance>,

    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    
    private readonly mailService: MailService
  ) { }


  async notificarUsuario(email: string, nombre: string, message: string) {
    const contenido = `
      <h1>Hola ${nombre}</h1>
      <p>${message}</p>
    `;
    await this.mailService.sendMail(email, 'Notificación de Edunormas', contenido);
  }



  // async create(createDtos: CreateStudentAttendanceDto[]) {
  //   try {
  //     // Validaciones básicas
  //     if (!createDtos || createDtos.length === 0) {
  //       return {
  //         success: false,
  //         message: 'No se recibieron datos para registrar',
  //         data: null,
  //       };
  //     }

  //     // Debug: Log de los datos recibidos
  //     console.log('Datos recibidos en create:', JSON.stringify(createDtos, null, 2));

  //     if (createDtos.length > 50) {
  //       return {
  //         success: false,
  //         message: 'No se pueden registrar más de 50 asistencias a la vez',
  //         data: null,
  //       };
  //     }

  //     // Tomar los parámetros comunes del primer registro
  //     const firstRecord = createDtos[0];
  //     const { date, trainingAreaId, degreeId, groupId } = firstRecord;

  //     // Verificar que todos los registros tengan los mismos parámetros clave
  //     const inconsistentRecords = createDtos.filter(dto =>
  //       dto.date !== date ||
  //       dto.trainingAreaId !== trainingAreaId ||
  //       dto.degreeId !== degreeId ||
  //       dto.groupId !== groupId
  //     );

  //     if (inconsistentRecords.length > 0) {
  //       console.log('Registros inconsistentes encontrados:', inconsistentRecords);
  //       return {
  //         success: false,
  //         message: 'Todos los registros deben tener la misma fecha, área de formación, grado y grupo',
  //         data: null,
  //       };
  //     }

  //     // Eliminar registros existentes para estos parámetros
  //     const deleteResult = await this.attendanceRepository
  //       .createQueryBuilder()
  //       .delete()
  //       .from(StudentAttendance)
  //       .where('date = :date', { date })
  //       .andWhere('training_area_id = :trainingAreaId', { trainingAreaId })
  //       .andWhere('degree_id = :degreeId', { degreeId })
  //       .andWhere('group_id = :groupId', { groupId })
  //       .execute();

  //     console.log('Registros eliminados:', deleteResult.affected);

  //     // Crear y guardar los nuevos registros
  //     const attendances = createDtos.map(dto => {
  //       const attendance = this.attendanceRepository.create({
  //         date: dto.date,
  //         attended: dto.attended,
  //         observations: dto.observations,
  //         studentId: dto.studentId,
  //         trainingAreaId: dto.trainingAreaId,
  //         administratorId: dto.administratorId,
  //         degreeId: dto.degreeId,
  //         groupId: dto.groupId
  //       });

  //       console.log('Attendance creada:', attendance);
  //       return attendance;
  //     });

  //     const savedAttendances = await this.attendanceRepository.save(attendances);

  //     console.log('Asistencias guardadas:', savedAttendances);

  //     return {
  //       success: true,
  //       message: `Se registraron ${savedAttendances.length} asistencias exitosamente`,
  //       data: savedAttendances,
  //     };
  //   } catch (error) {
  //     console.error('Error completo en create:', error);
  //     return {
  //       success: false,
  //       message: `Error al registrar asistencias: ${error.message}`,
  //       data: null,
  //     };
  //   }
  // }

  async create(createDtos: CreateStudentAttendanceDto[]) {
    try {
      if (!createDtos || createDtos.length === 0) {
        return { success: false, message: 'No se recibieron datos para registrar', data: null };
      }
  
      if (createDtos.length > 50) {
        return { success: false, message: 'No se pueden registrar más de 50 asistencias a la vez', data: null };
      }
  
      const { date, trainingAreaId, degreeId, groupId } = createDtos[0];
  
      const inconsistentRecords = createDtos.filter(dto =>
        dto.date !== date || dto.trainingAreaId !== trainingAreaId || dto.degreeId !== degreeId || dto.groupId !== groupId
      );
  
      if (inconsistentRecords.length > 0) {
        return {
          success: false,
          message: 'Todos los registros deben tener la misma fecha, área de formación, grado y grupo',
          data: null,
        };
      }
  
      // 1. Eliminar registros anteriores
      await this.attendanceRepository
        .createQueryBuilder()
        .delete()
        .from(StudentAttendance)
        .where('date = :date', { date })
        .andWhere('training_area_id = :trainingAreaId', { trainingAreaId })
        .andWhere('degree_id = :degreeId', { degreeId })
        .andWhere('group_id = :groupId', { groupId })
        .execute();
  
      // 2. Crear nuevas asistencias
      const attendances = createDtos.map(dto => this.attendanceRepository.create(dto));
      const savedAttendances = await this.attendanceRepository.save(attendances);
  
      // 3. RESPONDER al frontend inmediatamente
      setTimeout(() => this.sendAbsenceEmails(savedAttendances), 100); // ↪ enviar luego sin bloquear
  
      return {
        success: true,
        message: `Se registraron ${savedAttendances.length} asistencias exitosamente`,
        data: savedAttendances,
      };
  
    } catch (error) {
      console.error('Error completo en create:', error);
      return {
        success: false,
        message: `Error al registrar asistencias: ${error.message}`,
        data: null,
      };
    }
  }

  private async sendAbsenceEmails(attendances: StudentAttendance[]) {
    try {
      for (const record of attendances) {
        if (record.attended === false) {
          const student = await this.studentRepository.findOne({
            where: { id: record.studentId },
            relations: ['user'],
          });
  
          if (student && student.user?.notificationEmail) {
            const nombre = `${student.user.firstName} ${student.user.lastName}`;
            const message = `
              Hola ${nombre},<br><br>
              Se ha registrado una <strong>inasistencia</strong> el día <strong>${new Date(record.date).toLocaleDateString()}</strong> en el sistema <strong>Edunormas</strong>.<br>
              Observación: <em>${record.observations || 'Sin observación'}</em>.<br><br>
              Por favor acércate a coordinación si tienes justificación.
            `;
  
            await this.notificarUsuario(student.user.notificationEmail, nombre, message);
          }
        }
      }
    } catch (error) {
      console.error('❌ Error al enviar correos de inasistencia:', error.message);
    }
  }
  




  async findByCriteria(findDto: FindAttendanceDto) {
    try {
      const { date, trainingAreaId, degreeId, groupId } = findDto;

      console.log('Buscando asistencias con criterios:', { date, trainingAreaId, degreeId, groupId });

      // Consulta directa sin joins - solo los datos de la tabla attendance
      const attendances = await this.attendanceRepository
        .createQueryBuilder('attendance')
        .where('attendance.date = :date', { date })
        .andWhere('attendance.training_area_id = :trainingAreaId', { trainingAreaId })
        .andWhere('attendance.degree_id = :degreeId', { degreeId })
        .andWhere('attendance.group_id = :groupId', { groupId })
        .orderBy('attendance.student_id', 'ASC') // Ordenar por studentId
        .getMany();

      console.log('Asistencias encontradas:', attendances.length);
      console.log('Datos raw:', attendances);

      // Mapeo simple - devolver todos los datos que tienes en la tabla
      const mappedAttendances = attendances.map(att => ({
        id: att.id,
        attended: att.attended,
        observations: att.observations,
        date: att.date,
        studentId: att.studentId, // Este valor debe existir ahora
        trainingAreaId: att.trainingAreaId,
        administratorId: att.administratorId,
        degreeId: att.degreeId,
        groupId: att.groupId,
        createdAt: att.createdAt,
        updatedAt: att.updatedAt,
        // Agregar nombre del estudiante solo si necesitas hacer el join opcional
        studentName: null // Por ahora null, podemos agregarlo después si es necesario
      }));

      console.log('Datos mapeados:', mappedAttendances);

      return {
        success: true,
        message: 'Asistencias obtenidas exitosamente',
        data: mappedAttendances
      };
    } catch (error) {
      console.error('Error completo en findByCriteria:', error);
      return {
        success: false,
        message: `Error al obtener asistencias: ${error.message}`,
        data: null
      };
    }
  }




  async findAll(studentId?: number, trainingAreaId?: number, startDate?: Date, endDate?: Date) {
    try {
      const queryBuilder = this.attendanceRepository
        .createQueryBuilder('attendance')
        .leftJoinAndSelect('attendance.student', 'student')
        .leftJoinAndSelect('attendance.trainingArea', 'trainingArea');

      if (studentId) {
        queryBuilder.andWhere('attendance.studentId = :studentId', { studentId });
      }

      if (trainingAreaId) {
        queryBuilder.andWhere('attendance.trainingAreaId = :trainingAreaId', { trainingAreaId });
      }

      if (startDate && endDate) {
        queryBuilder.andWhere('attendance.date BETWEEN :startDate AND :endDate', {
          startDate,
          endDate,
        });
      }

      const attendances = await queryBuilder.getMany();

      return {
        success: true,
        message: 'Asistencias recuperadas exitosamente',
        data: attendances,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error al recuperar asistencias: ${error.message}`,
        data: null,
      };
    }
  }




  async sendEmail(studentId?: number, trainingAreaId?: number, startDate?: Date, endDate?: Date) {
    try {
      const queryBuilder = this.attendanceRepository
        .createQueryBuilder('attendance')
        .leftJoinAndSelect('attendance.student', 'student');

      if (studentId) {
        queryBuilder.andWhere('attendance.studentId = :studentId', { studentId });
      }

      if (trainingAreaId) {
        queryBuilder.andWhere('attendance.trainingAreaId = :trainingAreaId', { trainingAreaId });
      }

      if (startDate && endDate) {
        queryBuilder.andWhere('attendance.date BETWEEN :startDate AND :endDate', {
          startDate,
          endDate,
        });
      }

      const attendances = await queryBuilder.getMany();

      return {
        success: true,
        message: 'Asistencias recuperadas exitosamente',
        data: attendances,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error al recuperar asistencias: ${error.message}`,
        data: null,
      };
    }
  }








  async findOne(id: number) {
    try {
      const attendance = await this.attendanceRepository.findOne({
        where: { id },
        relations: ['student', 'trainingArea'],
      });

      if (!attendance) {
        return {
          success: false,
          message: `Asistencia con ID ${id} no encontrada`,
          data: null,
        };
      }

      return {
        success: true,
        message: 'Asistencia recuperada exitosamente',
        data: attendance,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error al recuperar asistencia: ${error.message}`,
        data: null,
      };
    }
  }

  async update(updateDtos: UpdateStudentAttendanceDto[]) {
    try {
      // Validaciones básicas
      if (!updateDtos || updateDtos.length === 0) {
        return {
          success: false,
          message: 'No se recibieron datos para actualizar',
          data: null,
        };
      }

      if (updateDtos.length > 50) {
        return {
          success: false,
          message: 'No se pueden actualizar más de 50 asistencias a la vez',
          data: null,
        };
      }

      // Verificar que todos los DTOs tengan ID
      if (updateDtos.some(dto => !dto.id)) {
        return {
          success: false,
          message: 'Todos los registros deben incluir un ID para actualización',
          data: null,
        };
      }

      // Actualizar registros en una transacción
      const updateOperations = updateDtos.map(async dto => {
        const existing = await this.attendanceRepository.findOne({ where: { id: dto.id } });
        if (!existing) {
          return null;
        }
        const updated = this.attendanceRepository.merge(existing, dto);
        return this.attendanceRepository.save(updated);
      });

      const updatedAttendances = await Promise.all(updateOperations);

      // Filtrar resultados nulos (registros no encontrados)
      const successfulUpdates = updatedAttendances.filter(att => att !== null);

      return {
        success: true,
        message: `Se actualizaron ${successfulUpdates.length} de ${updateDtos.length} asistencias`,
        data: successfulUpdates,
        errors: updatedAttendances.filter(att => att === null).length > 0
          ? `Algunos registros no se encontraron (${updatedAttendances.filter(att => att === null).length})`
          : undefined
      };
    } catch (error) {
      return {
        success: false,
        message: `Error al actualizar asistencias: ${error.message}`,
        data: null,
      };
    }
  }

  async remove(id: number) {
    try {
      const attendance = await this.attendanceRepository.findOne({
        where: { id },
      });

      if (!attendance) {
        return {
          success: false,
          message: `Asistencia con ID ${id} no encontrada`,
          data: null,
        };
      }

      await this.attendanceRepository.remove(attendance);

      return {
        success: true,
        message: 'Asistencia eliminada exitosamente',
        data: attendance,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error al eliminar asistencia: ${error.message}`,
        data: null,
      };
    }
  }
}