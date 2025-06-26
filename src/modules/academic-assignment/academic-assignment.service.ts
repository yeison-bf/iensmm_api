import { Injectable } from '@nestjs/common';
import { CreateAcademicAssignmentDto } from './dto/create-academic-assignment.dto';
import { UpdateAcademicAssignmentDto } from './dto/update-academic-assignment.dto';
import { AcademicAssignment } from './entities/academic-assignment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Headquarters } from '../headquarters/entities/headquarters.entity';
import { Administrator } from '../administrators/entities/administrator.entity';
import { AcademicThinkingDetail } from '../academic-thinking/entities/academic-thinking-detail.entity';
import { StudentEnrollment } from '../student-enrollment/entities/student-enrollment.entity';
import { AcademicAssignmentDetail } from './entities/academic-assignment-detail.entity';
import { Degree } from '../degrees/entities/degree.entity';
import { Program } from '../programs/entities/program.entity';
import { Group } from '../group/entities/group.entity';

@Injectable()
export class AcademicAssignmentService {

  constructor(
    @InjectRepository(AcademicAssignment)
    private readonly academicAssignmentRepository: Repository<AcademicAssignment>,
    @InjectRepository(AcademicAssignmentDetail)
    private readonly academicAssignmentDetailRepository: Repository<AcademicAssignmentDetail>,
    @InjectRepository(Degree)
    private readonly degreeRepository: Repository<Degree>,
    @InjectRepository(Headquarters)
    private readonly headquartersRepository: Repository<Headquarters>,
    @InjectRepository(AcademicThinkingDetail)
    private readonly academicThinkingDetailRepository: Repository<AcademicThinkingDetail>,
    @InjectRepository(StudentEnrollment)
    private readonly studentEnrollmentRepository: Repository<StudentEnrollment>,
    @InjectRepository(Administrator)
    private readonly administratorRepository: Repository<Administrator>,
    @InjectRepository(Program)
    private readonly programRepository: Repository<Program>,
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
  ) { }

  async create(createDto: CreateAcademicAssignmentDto) {
    try {
      const [degree, headquarters, program, group] = await Promise.all([
        this.degreeRepository.findOne({ where: { id: createDto.degreeId } }),
        this.headquartersRepository.findOne({ where: { id: createDto.headquarterId } }),
        this.programRepository.findOne({ where: { id: createDto.programId } }),
        this.groupRepository.findOne({ where: { id: createDto.groupId } })
      ]);

      if (!degree || !headquarters || !program) {
        return {
          success: false,
          message: !degree 
            ? `Degree with ID ${createDto.degreeId} not found`
            : !headquarters
            ? `Headquarters with ID ${createDto.headquarterId} not found`
            : `Program with ID ${createDto.programId} not found`,
          data: null
        };
      }

      // Create main assignment using IDs
      const assignment = this.academicAssignmentRepository.create({
        year: createDto.year,
        degreeId: createDto.degreeId,
        headquarterId: createDto.headquarterId,
        programId: createDto.programId,
        groupId: createDto.groupId,
        directorGroupId: createDto.directorGroupId,
      });

      const savedAssignment = await this.academicAssignmentRepository.save(assignment);

      // Create details using IDs
      const details = await Promise.all(
        createDto.details.map(async detail => {
          const [thinkingDetail, admin] = await Promise.all([
            this.academicThinkingDetailRepository.findOne({ where: { id: detail.academicThinkingDetailId } }),
            this.administratorRepository.findOne({ where: { id: detail.administratorId } })
          ]);

          if (!thinkingDetail || !admin) {
            throw new Error(`Required relation not found for detail`);
          }

          return this.academicAssignmentDetailRepository.create({
            academicAssignmentId: savedAssignment.id,
            academicThinkingDetailId: detail.academicThinkingDetailId,
            administratorId: detail.administratorId
          });
        })
      );

      await this.academicAssignmentDetailRepository.save(details);

      // Fetch complete assignment with relations
      const completeAssignment = await this.academicAssignmentRepository.findOne({
        where: { id: savedAssignment.id },
        relations: [
          'degree',
          'headquarters',
          'program',
          'details',
          'details.academicThinkingDetail',
          'details.administrator'
        ]
      });

      return {
        success: true,
        message: 'Asignación académica creada exitosamente',
        data: completeAssignment
      };
    } catch (error) {
      return {
        success: false,
        message: `Error al crear la asignación académica: ${error.message}`,
        data: null
      };
    }
  }




















  // async findAll(headquarterId?:number, programId?:number) {
  //   const assignments = await this.academicAssignmentRepository.find({
  //     where: {
  //       headquarterId: headquarterId,
  //       programId: programId
  //     },
  //     relations: [
  //       'degree',
  //       'headquarters',
  //       'program'
  //     ]
  //   });

  //   return {
  //     success: true,
  //     message: 'Asignaciones académicas recuperadas exitosamente',
  //     data: assignments
  //   };
  // }



  async findAll(headquarterId?: number, programId?: number) {
    // 1. Obtener las asignaciones académicas como antes
    const assignments = await this.academicAssignmentRepository.find({
      where: {
        headquarterId: headquarterId,
        programId: programId
      },
      relations: [
        'degree',
        'headquarters',
        'program'
      ]
    });
  
    // 2. Enriquecer los datos con la información del director
    const enrichedAssignments = await Promise.all(
      assignments.map(async (assignment) => {
        // Si no hay director asignado, retornar el assignment sin modificar
        if (!assignment.directorGroupId || assignment.directorGroupId === 0) {
          return {
            ...assignment,
            director: null
          };
        }
  
        // Buscar la información del administrador/director
        const director = await this.administratorRepository.findOne({
          where: { id: assignment.directorGroupId },
          relations: ['user'] // Asumiendo que tienes relación con User
        });
  
        return {
          ...assignment,
          director: director ? {
            id: director.id,
            name: `${director.user.firstName} ${director.user.lastName}`,
            // Agrega más campos si los necesitas
            academicTitle: director.academicTitle,
            trainingArea: director.trainingArea
          } : null
        };
      })
    );
  
    return {
      success: true,
      message: 'Asignaciones académicas recuperadas exitosamente',
      data: enrichedAssignments
    };
  }



  async findAssignmentByCriteria(
    degreeId: number,
    groupId: number,
    headquarterId: number,
    year: number
  ) {
    console.log("--- paso aqui ")
    try {
      const assignment = await this.academicAssignmentRepository
        .createQueryBuilder('assignment')
        .leftJoinAndSelect('assignment.degree', 'degree')
        .leftJoinAndSelect('assignment.group', 'group')
        .leftJoinAndSelect('assignment.headquarters', 'headquarters')
        .leftJoinAndSelect('assignment.program', 'program')
        .leftJoinAndSelect('assignment.details', 'details')
        // .leftJoinAndSelect('details.academicThinkingDetail', 'academicThinkingDetail')
        // .leftJoinAndSelect('academicThinkingDetail.trainingArea', 'trainingArea')
        .where('assignment.degree_id = :degreeId', { degreeId })
        .andWhere('assignment.group_id = :groupId', { groupId })
        .andWhere('assignment.headquarter_id = :headquarterId', { headquarterId })
        .andWhere('assignment.year = :year', { year })
        .getOne();

      if (!assignment) {
        return {
          success: false,
          message: 'No se encontró la asignación académica con los criterios proporcionados',
          data: null,
        };
      }

      return {
        success: true,
        message: 'Asignación académica encontrada',
        data: assignment,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error al buscar asignación académica: ${error.message}`,
        data: null,
      };
    }
  }


  


  
  async findAllByRatign(headquarterId?:number, programId?:number, groupId?:number, degreeId?:number) {
    console.log("--")
    const assignments = await this.academicAssignmentRepository.find({
      where: {
        headquarterId: headquarterId,
        programId: programId,
        groupId: groupId,
        degreeId: degreeId
      },
      relations: [
        'degree',
        'headquarters',
        'program',
        'details',
        'details.academicThinkingDetail',
        'details.academicThinkingDetail.trainingArea',
      ]
    });

    return {
      success: true,
      message: 'Asignaciones académicas recuperadas exitosamente',
      data: assignments
    };
  }







  async findOneByTeacher(id: number, yeart?: number) {
    const assignment = await this.academicAssignmentRepository.find({
      where: { directorGroupId: id, year: yeart },
      relations: [
        'degree',
        'group',
        'program'
      ]
    });

    if (!assignment) {
      return {
        success: false,
        message: `Asignación académica con ID ${id} no encontrada`,
        data: null
      };
    }

    return {
      success: true,
      message: 'Asignación académica recuperada exitosamente',
      data: assignment
    };
  }














  async findOne(id: number) {
    const assignment = await this.academicAssignmentRepository.findOne({
      where: { id },
      relations: [
        'degree',
        'headquarters',
        'program',
        'details',
        'details.academicThinkingDetail',
        'details.administrator'
      ]
    });

    if (!assignment) {
      return {
        success: false,
        message: `Asignación académica con ID ${id} no encontrada`,
        data: null
      };
    }

    return {
      success: true,
      message: 'Asignación académica recuperada exitosamente',
      data: assignment
    };
  }


  // async getAssignmentsByAdministrator(administratorId: number) {
  //   const assignmentsDetails = await this.academicAssignmentDetailRepository.find({
  //     where: { administratorId },
  //     relations: [
  //       'academicAssignment',
  //       'academicAssignment.degree',
  //       'academicAssignment.headquarters',
  //       'academicAssignment.program',
  //       'academicAssignment.group',
  //     ],
  //   });

  //   // Procesamos los datos para devolver la información estructurada
  //   return assignmentsDetails.map(detail => {
  //     const assignment = detail.academicAssignment;
  //     return {
  //       assignmentDetailId: detail.id,
  //       assignmentId: assignment.id,
  //       year: assignment.year,
  //       degree: {
  //         id: assignment.degree.id,
  //         name: assignment.degree.name, // Asumiendo que Degree tiene un campo 'name'
  //       },
  //       headquarter: {
  //         id: assignment.headquarters.id,
  //         name: assignment.headquarters.name, // Asumiendo que Headquarters tiene un campo 'name'
  //       },
  //       program: {
  //         id: assignment.program.id,
  //         name: assignment.program.name, // Asumiendo que Program tiene un campo 'name'
  //       },
  //       group: {
  //         id: assignment.group.id,
  //         name: assignment.group.name, // Asumiendo que Group tiene un campo 'name'
  //       },
  //       directorGroupId: assignment.directorGroupId,
  //       createdAt: assignment.createdAt,
  //       updatedAt: assignment.updatedAt,
  //     };
  //   });
  // }


  async getAssignmentsByAdministrator(administratorId: number, yeart?: number) {
    const assignmentsDetails = await this.academicAssignmentDetailRepository.find({
      where: { administratorId, academicAssignment: { year: yeart } },
      relations: [
        'academicAssignment',
        'academicAssignment.degree',
        'academicAssignment.headquarters',
        'academicAssignment.program',
        'academicAssignment.group',
        'academicThinkingDetail',
        'academicThinkingDetail.trainingArea', // Nueva relación añadida
      ],
    });

    return assignmentsDetails.map(detail => {
      const assignment = detail.academicAssignment;
      const thinkingDetail = detail.academicThinkingDetail;
      
      return {
        assignmentDetailId: detail.id,
        AcademicThinkingDetail: detail.academicThinkingDetail,
        assignmentId: assignment.id,
        year: assignment.year,
        degree: {
          id: assignment.degree.id,
          name: assignment.degree.name,
        },
        headquarter: {
          id: assignment.headquarters.id,
          name: assignment.headquarters.name,
        },
        program: {
          id: assignment.program.id,
          name: assignment.program.name,
        },
        group: {
          id: assignment.group.id,
          name: assignment.group.name,
        },
        directorGroupId: assignment.directorGroupId,
        // Nueva información de la asignatura
        subject: {
          id: thinkingDetail.trainingArea.id,
          name: thinkingDetail.trainingArea.name, // Asumiendo que TrainingArea tiene 'name'
          hourlyIntensity: thinkingDetail.hourlyIntensity,
          percentage: thinkingDetail.percentage,
        },
        createdAt: assignment.createdAt,
        updatedAt: assignment.updatedAt,
      };
    });
  }




  async findOneByDirectGroup(id: number) {
    const assignment = await this.academicAssignmentRepository.findOne({
      where: { directorGroupId: id },
      relations: [
        'degree',
        'headquarters',
        'program',
      ]
    });

    if (!assignment) {
      return {
        success: false,
        message: `Asignación académica con ID ${id} no encontrada`,
        data: null
      };
    }

    return {
      success: true,
      message: 'Asignación académica recuperada exitosamente',
      data: assignment
    };
  }









    async update(id: number, updateDto: UpdateAcademicAssignmentDto) {
    try {
      const assignment = await this.academicAssignmentRepository.findOne({
        where: { id },
        relations: ['details']
      });

      if (!assignment) {
        return {
          success: false,
          message: `Asignación académica con ID ${id} no encontrada`,
          data: null
        };
      }

      // Verify and get related entities
      const [degree, headquarters, program, group] = await Promise.all([
        this.degreeRepository.findOne({ where: { id: updateDto.degreeId } }),
        this.headquartersRepository.findOne({ where: { id: updateDto.headquarterId } }),
        this.programRepository.findOne({ where: { id: updateDto.programId } }),
        this.groupRepository.findOne({ where: { id: updateDto.groupId } })
      ]);

      if (!degree || !headquarters || !program) {
        return {
          success: false,
          message: !degree 
            ? `Degree with ID ${updateDto.degreeId} not found`
            : !headquarters
            ? `Headquarters with ID ${updateDto.headquarterId} not found`
            : `Program with ID ${updateDto.programId} not found`,
          data: null
        };
      }

      // Update main assignment
      Object.assign(assignment, {
        year: updateDto.year,
        degreeId: updateDto.degreeId,
        headquarterId: updateDto.headquarterId,
        programId: updateDto.programId,
        groupId: updateDto.groupId,
        directorGroupId: updateDto.directorGroupId,
      });

      await this.academicAssignmentRepository.save(assignment);

      // Remove old details
      if (assignment.details?.length) {
        await this.academicAssignmentDetailRepository.remove(assignment.details);
      }

      // Create new details
      if (updateDto.details?.length) {
        const details = await Promise.all(
          updateDto.details.map(async detail => {
            const [thinkingDetail, admin] = await Promise.all([
              this.academicThinkingDetailRepository.findOne({ 
                where: { id: detail.academicThinkingDetailId } 
              }),
              this.administratorRepository.findOne({ 
                where: { id: detail.administratorId } 
              })
            ]);

            if (!thinkingDetail || !admin) {
              throw new Error(`Required relation not found for detail`);
            }

            return this.academicAssignmentDetailRepository.create({
              academicAssignmentId: assignment.id,
              academicThinkingDetailId: detail.academicThinkingDetailId,
              administratorId: detail.administratorId
            });
          })
        );

        await this.academicAssignmentDetailRepository.save(details);
      }

      // Fetch updated assignment with all relations
      const updatedAssignment = await this.academicAssignmentRepository.findOne({
        where: { id },
        relations: [
          'degree',
          'headquarters',
          'program',
          'details',
          'details.academicThinkingDetail',
          'details.administrator'
        ]
      });

      return {
        success: true,
        message: 'Asignación académica actualizada exitosamente',
        data: updatedAssignment
      };
    } catch (error) {
      return {
        success: false,
        message: `Error al actualizar la asignación académica: ${error.message}`,
        data: null
      };
    }
  }










  async remove(id: number) {
    try {
      const assignment = await this.academicAssignmentRepository
        .createQueryBuilder('assignment')
        .leftJoinAndSelect('assignment.details', 'details')
        .leftJoinAndSelect('details.academicThinkingDetail', 'thinkingDetail')
        .leftJoinAndSelect('thinkingDetail.grades', 'grades')
        .where('assignment.id = :id', { id })
        .getOne();

      if (!assignment) {
        return {
          success: false,
          message: 'Asignación académica no encontrada',
          data: null
        };
      }

      // Check if any detail has grades
      const detailsWithGrades = assignment.details.filter(detail => 
        detail.academicThinkingDetail?.grades?.length > 0
      );

      if (detailsWithGrades.length > 0) {
        return {
          success: false,
          message: 'No se puede eliminar la asignación académica porque ya existen calificaciones registradas para algunos estudiantes',
        };
      }

      // If no grades exist, proceed with deletion
      await this.academicAssignmentDetailRepository.remove(assignment.details);
      await this.academicAssignmentRepository.remove(assignment);

      return {
        success: true,
        message: 'Asignación académica eliminada exitosamente',
        data: assignment
      };
    } catch (error) {
      return {
        success: false,
        message: `Error al eliminar la asignación académica: ${error.message}`,
        data: null
      };
    }
  }
}