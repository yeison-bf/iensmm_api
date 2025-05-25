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




















  async findAll(headquarterId?:number, programId?:number) {
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

    return {
      success: true,
      message: 'Asignaciones académicas recuperadas exitosamente',
      data: assignments
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
    const result = await this.academicAssignmentRepository.delete(id);

    if (result.affected === 0) {
      return {
        success: false,
        message: `Asignación académica con ID ${id} no encontrada`,
        data: null
      };
    }

    return {
      success: true,
      message: 'Asignación académica eliminada exitosamente',
      data: null
    };
  }
}
