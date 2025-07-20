import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentEnrollment } from './entities/student-enrollment.entity';
import { CreateStudentEnrollmentDto } from './dto/create-student-enrollment.dto';
import { Student } from '../students/entities/student.entity';
import { Group } from '../group/entities/group.entity';
import { Degree } from '../degrees/entities/degree.entity';
import { Program } from '../programs/entities/program.entity';
import { MailService } from 'src/mail/mail.service';

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

    @InjectRepository(Program)
    private readonly programRepository: Repository<Program>,

    private readonly mailService: MailService


  ) { }


  async notificarUsuario(email: string, nombre: string, message: string) {
    const contenido = `
      <h1>Hola ${nombre}</h1>
      <p>${message}</p>
    `;
    await this.mailService.sendMail(email, 'Notificación de Edunormas', contenido);
  }




  async create(createEnrollmentDto: CreateStudentEnrollmentDto) {
    try {
      const [student, group, degree, program] = await Promise.all([
        this.studentRepository.findOne({
          where: { id: createEnrollmentDto.studentId }
        }),
        this.groupRepository.findOne({
          where: { id: createEnrollmentDto.groupId }
        }),
        this.degreeRepository.findOne({
          where: { id: createEnrollmentDto.degreeId }
        }),
        this.programRepository.findOne({
          where: { id: createEnrollmentDto.programId }
        })
      ]);

      if (!student || !group || !degree) {
        return {
          success: false,
          message: 'Student, Group or Degree not found',
          data: null,
        };
      }

      // Update student with program and institution
      await this.studentRepository.save({
        ...student,
        programId: createEnrollmentDto.programId,
        institution: createEnrollmentDto.institutionId
      });

      // Create enrollment with relations
      const enrollment = this.enrollmentRepository.create({
        schedule: createEnrollmentDto.schedule,
        folio: createEnrollmentDto.folio,
        registrationDate: createEnrollmentDto.registrationDate,
        type: createEnrollmentDto.type,
        status: createEnrollmentDto.status,
        observations: createEnrollmentDto.observations,
        student,
        group,
        degree,
        program,
        programId: createEnrollmentDto.programId,
        headquarterId: createEnrollmentDto.headquarterId,
        institutionId: createEnrollmentDto.institutionId
      });

      const savedEnrollment = await this.enrollmentRepository.save(enrollment);

      // Fetch the complete enrollment with all relations
      const completeEnrollment = await this.enrollmentRepository.findOne({
        where: { id: savedEnrollment.id },
        relations: ['student', 'student.user', 'group', 'degree', 'program']
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



  async findAll(
    headquarterId?: number,
    year?: string,
    programId?: number,
    page?: number,
    limit?: number
  ) {
    console.log('headquarterId', headquarterId)
    try {
      const queryBuilder = this.enrollmentRepository
        .createQueryBuilder('enrollment')
        .leftJoinAndSelect('enrollment.student', 'student')
        .leftJoinAndSelect('student.user', 'user')
        .leftJoinAndSelect('enrollment.group', 'group')
        .leftJoinAndSelect('enrollment.degree', 'degree')
        .leftJoinAndSelect('enrollment.program', 'program')
        .orderBy('enrollment.createdAt', 'DESC')
        .where('enrollment.status = :status', { status: true })

      if (headquarterId) {
        queryBuilder.andWhere('enrollment.headquarter_id = :headquarterId', { headquarterId });
      }

      if (year) {
        queryBuilder.andWhere('YEAR(enrollment.createdAt) = :year', { year });
      }

      if (programId) {
        queryBuilder.andWhere('enrollment.program_id = :programId', { programId });
      }

      // Si se proporcionan parámetros de paginación
      if (page && limit) {
        const skip = (page - 1) * limit;
        const [enrollments, total] = await queryBuilder
          .skip(skip)
          .take(limit)
          .getManyAndCount();

        return {
          success: true,
          message: 'Matrículas recuperadas exitosamente',
          data: {
            items: enrollments,
            meta: {
              currentPage: page,
              itemsPerPage: limit,
              totalItems: total,
              totalPages: Math.ceil(total / limit)
            }
          }
        };
      }

      // Si no hay paginación, devolver todos los resultados
      const enrollments = await queryBuilder.getMany();
      return {
        success: true,
        message: 'Matrículas recuperadas exitosamente',
        data: enrollments
      };
    } catch (error) {
      return {
        success: false,
        message: `Error al recuperar las matrículas: ${error.message}`,
        data: null,
      };
    }
  }


  async findAllListStudend(
    headquarterId?: number,
    year?: string,
    programId?: number,
    group?: number,
    degree?: number,
  ) {
    try {
      const queryBuilder = this.enrollmentRepository
        .createQueryBuilder('enrollment')
        .leftJoinAndSelect('enrollment.student', 'student')
        .leftJoinAndSelect('student.user', 'user')
        .leftJoinAndSelect('enrollment.group', 'group')
        .leftJoinAndSelect('enrollment.degree', 'degree')
        .leftJoinAndSelect('enrollment.program', 'program')
        .orderBy('enrollment.createdAt', 'DESC');

      if (headquarterId) {
        queryBuilder.andWhere('enrollment.headquarterId = :headquarterId', { headquarterId });
      }

      if (year) {
        queryBuilder.andWhere('YEAR(enrollment.registrationDate) = :year', { year });
      }

      if (programId) {
        queryBuilder.andWhere('enrollment.program_id = :programId', { programId });
      }

      if (group) {
        queryBuilder.andWhere('enrollment.groupId = :group', { group });
      }

      if (degree) {
        queryBuilder.andWhere('enrollment.degreeId = :degree', { degree });
      }


      // Si no hay paginación, devolver todos los resultados
      const enrollments = await queryBuilder.getMany();
      return {
        success: true,
        message: 'Matrículas recuperadas exitosamente',
        data: enrollments
      };
    } catch (error) {
      return {
        success: false,
        message: `Error al recuperar las matrículas: ${error.message}`,
        data: null,
      };
    }
  }




  async sendEmail(
    asignatura?: string,
    year?: string,
    programId?: number,
    group?: number,
    degree?: number,
  ) {
    try {

      const today = new Date();
      const formattedDate = today.toLocaleDateString('es-CO', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });


      const queryBuilder = this.enrollmentRepository
        .createQueryBuilder('enrollment')
        .leftJoinAndSelect('enrollment.student', 'student')
        .leftJoinAndSelect('student.user', 'user')
        .orderBy('enrollment.createdAt', 'DESC');

      if (year) {
        queryBuilder.andWhere('YEAR(enrollment.registrationDate) = :year', { year });
      }

      if (group) {
        queryBuilder.andWhere('enrollment.groupId = :group', { group });
      }

      if (degree) {
        queryBuilder.andWhere('enrollment.degreeId = :degree', { degree });
      }

      // Obtener todas las matrículas
      const enrollments = await queryBuilder.getMany();

      // Enviar correo a cada uno
      for (const enrollment of enrollments) {
        const user = enrollment.student?.user;

        if (user?.notificationEmail) {
          const nombre = `${user.firstName} ${user.lastName}`;
          const message = `
          Te notificamos que tus calificaciones en la asignatura <strong>${asignatura}</strong> han sido registradas en la plataforma <strong>Edunormas</strong>.<br><br>
          Fecha de registro: <strong>${formattedDate}</strong>.<br><br>
          Por favor, revisa tu calificación. Si no estás de acuerdo con el resultado, te invitamos a comunicarte con el docente del área correspondiente.<br><br>
          ¡Gracias por ser parte de nuestra comunidad!
        `;
          await this.notificarUsuario(user.notificationEmail, nombre, message);
        }
      }

      return {
        success: true,
        message: 'Matrículas recuperadas y correos enviados exitosamente',
        data: enrollments
      };

    } catch (error) {
      console.error('❌ Error al enviar correos:', error);
      return {
        success: false,
        message: `Error al recuperar las matrículas y enviar correos: ${error.message}`,
        data: null,
      };
    }
  }










  async findAllDegree(headquarterId?: number, year?: string, programId?: number) {
    try {
      const queryBuilder = this.enrollmentRepository
        .createQueryBuilder('enrollment')
        .select([
          'degree.id',
          'degree.name',
          'program.id',
          'program.name',
          'COUNT(DISTINCT enrollment.id) as studentCount',
          'GROUP_CONCAT(DISTINCT CONCAT(group.id, ":", group.name)) as groups'
        ])
        .leftJoin('enrollment.degree', 'degree')
        .leftJoin('enrollment.program', 'program')
        .leftJoin('enrollment.group', 'group')
        .groupBy('degree.id')
        .addGroupBy('program.id')
        .orderBy('degree.name', 'ASC');

      if (headquarterId) {
        queryBuilder.andWhere('enrollment.headquarterId = :headquarterId', { headquarterId });
      }

      if (year) {
        queryBuilder.andWhere('YEAR(enrollment.registrationDate) = :year', { year });
      }

      if (programId) {
        queryBuilder.andWhere('enrollment.program_id = :programId', { programId });
      }

      const enrollments = await queryBuilder.getRawMany();

      const formattedResult = enrollments.map(item => ({
        degree: {
          id: item.degree_id,
          name: item.degree_name
        },
        program: {
          id: item.program_id,
          name: item.program_name
        },
        groups: item.groups ? item.groups.split(',').map(group => {
          const [id, name] = group.split(':');
          return {
            id: parseInt(id),
            name: name
          };
        }) : [],
        studentCount: parseInt(item.studentCount)
      }));

      return {
        success: true,
        message: 'Matrículas agrupadas por grado recuperadas exitosamente',
        data: formattedResult,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error al recuperar las matrículas: ${error.message}`,
        data: null,
      };
    }
  }



  async findByStudentId(studentId: number): Promise<StudentEnrollment[]> {
    return this.enrollmentRepository.find({
      where: { student: { id: studentId } },
      relations: ['degree'], // 👈 Incluye la relación con Degree
      order: { registrationDate: 'DESC' },
    });
  }



  async update(id: number, updateEnrollmentDto: CreateStudentEnrollmentDto) {
    try {
      const enrollment = await this.enrollmentRepository.findOne({
        where: { id },
        relations: ['student', 'group', 'degree', 'program']
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

        // Update student with program and institution
        await this.studentRepository.save({
          ...student,
          programId: updateEnrollmentDto.programId,
          institution: updateEnrollmentDto.institutionId
        });
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

      if (updateEnrollmentDto.programId) {
        const program = await this.programRepository.findOne({
          where: { id: updateEnrollmentDto.programId }
        });
        if (!program) {
          return {
            success: false,
            message: 'Program not found',
            data: null,
          };
        }
        enrollment.program = program;
      }

      // Update basic fields
      enrollment.schedule = updateEnrollmentDto.schedule ?? enrollment.schedule;
      enrollment.folio = updateEnrollmentDto.folio ?? enrollment.folio;
      enrollment.registrationDate = updateEnrollmentDto.registrationDate ?? enrollment.registrationDate;
      enrollment.type = updateEnrollmentDto.type ?? enrollment.type;
      enrollment.observations = updateEnrollmentDto.observations ?? enrollment.observations;
      enrollment.programId = updateEnrollmentDto.programId ?? enrollment.programId;
      enrollment.institutionId = updateEnrollmentDto.institutionId ?? enrollment.institutionId;
      enrollment.headquarterId = updateEnrollmentDto.headquarterId ?? enrollment.headquarterId;

      const updatedEnrollment = await this.enrollmentRepository.save(enrollment);

      // Fetch complete updated data
      const completeEnrollment = await this.enrollmentRepository.findOne({
        where: { id: updatedEnrollment.id },
        relations: ['student', 'student.user', 'group', 'degree', 'program']
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