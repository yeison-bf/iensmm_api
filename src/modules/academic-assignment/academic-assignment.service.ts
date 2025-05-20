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

@Injectable()
export class AcademicAssignmentService {

  constructor(
    @InjectRepository(AcademicAssignment)
    private readonly academicAssignmentRepository: Repository<AcademicAssignment>,

    @InjectRepository(Headquarters)
    private readonly headquartersRepository: Repository<Headquarters>,
    @InjectRepository(Administrator)
    private readonly administratorRepository: Repository<Administrator>,
    @InjectRepository(AcademicThinkingDetail)
    private readonly academicThinkingDetailRepository: Repository<AcademicThinkingDetail>,
    @InjectRepository(StudentEnrollment)
    private readonly studentEnrollmentRepository: Repository<StudentEnrollment>,

  ) {}

  async create(createAcademicAssignmentDto: CreateAcademicAssignmentDto) {
    try {
      // Verificar que headquarters existe
      const headquarters = await this.headquartersRepository.findOne({
        where: { id: createAcademicAssignmentDto.headquartersId }
      });
      if (!headquarters) {
        return {
          success: false,
          message: `La sede con ID ${createAcademicAssignmentDto.headquartersId} no existe`,
          data: null
        };
      }

      // Verificar que administrator existe
      const administrator = await this.administratorRepository.findOne({
        where: { id: createAcademicAssignmentDto.administratorId }
      });
      if (!administrator) {
        return {
          success: false,
          message: `El administrador con ID ${createAcademicAssignmentDto.administratorId} no existe`,
          data: null
        };
      }

      // Verificar que academicThinkingDetail existe
      const academicThinkingDetail = await this.academicThinkingDetailRepository.findOne({
        where: { id: createAcademicAssignmentDto.academicThinkingDetailId }
      });
      if (!academicThinkingDetail) {
        return {
          success: false,
          message: `El detalle de pensamiento académico con ID ${createAcademicAssignmentDto.academicThinkingDetailId} no existe`,
          data: null
        };
      }

      // Verificar que studentEnrollment existe
      const studentEnrollment = await this.studentEnrollmentRepository.findOne({
        where: { id: createAcademicAssignmentDto.studentEnrollmentId }
      });
      if (!studentEnrollment) {
        return {
          success: false,
          message: `La matrícula con ID ${createAcademicAssignmentDto.studentEnrollmentId} no existe`,
          data: null
        };
      }

      const academicAssignment = this.academicAssignmentRepository.create({
        ...createAcademicAssignmentDto,
        headquarters,
        administrator,
        academicThinkingDetail,
        studentEnrollment
      });

      const saved = await this.academicAssignmentRepository.save(academicAssignment);

      const result = await this.academicAssignmentRepository.findOne({
        where: { id: saved.id },
        relations: [
          'headquarters',
          'administrator',
          'academicThinkingDetail',
          'studentEnrollment'
        ]
      });

      return {
        success: true,
        message: 'Asignación académica creada exitosamente',
        data: result
      };
    } catch (error) {
      return {
        success: false,
        message: `Error al crear la asignación académica: ${error.message}`,
        data: null
      };
    }
  }

  async findAll() {
    return this.academicAssignmentRepository.find({
      relations: [
        'administrator',
        'academicThinkingDetail',
        'academicThinkingDetail.trainingArea',
        'studentEnrollment',
        'studentEnrollment.student'
      ],
    });
  }

  async findOne(id: number) {
    return this.academicAssignmentRepository.findOne({
      where: { id },
      relations: [
        'attendant',
        'administrator',
        'academicThinkingDetail',
        'academicThinkingDetail.trainingArea',
        'studentEnrollment',
        'studentEnrollment.student'
      ],
    });
  }



  update(id: number, updateAcademicAssignmentDto: UpdateAcademicAssignmentDto) {
    return `This action updates a #${id} academicAssignment`;
  }

  remove(id: number) {
    return `This action removes a #${id} academicAssignment`;
  }
}
