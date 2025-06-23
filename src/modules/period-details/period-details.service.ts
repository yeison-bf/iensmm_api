import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { PeriodDetail } from './entities/period-detail.entity';
import { Period } from '../periods/entities/period.entity';
import { CreatePeriodDetailDto } from './dto/create-period-detail.dto';
import { UpdatePerioDetaildDto } from './dto/update-period-detail.dto';
import { StudentGrade } from '../student-grades/entities/student-grade.entity';

@Injectable()
export class PeriodDetailsService {
  constructor(
    @InjectRepository(PeriodDetail)
    private readonly periodDetailRepository: Repository<PeriodDetail>,
    @InjectRepository(Period)
    private readonly periodRepository: Repository<Period>,

    @InjectRepository(StudentGrade)
    private readonly studentGradeRepository: Repository<StudentGrade>,


  ) { }

  async create(createPeriodDetailDto: CreatePeriodDetailDto) {
    try {
      const period = await this.periodRepository.findOne({
        where: { id: createPeriodDetailDto.periodId },
      });

      if (!period) {
        return {
          success: false,
          message: 'Period not found',
          data: null,
        };
      }

      const existingDetails = await this.periodDetailRepository.count({
        where: { period: { id: createPeriodDetailDto.periodId } },
      });

      if (existingDetails >= period.periodsQuantity) {
        return {
          success: false,
          message: 'Maximum number of periods reached',
          data: null,
        };
      }

      const periodDetail = this.periodDetailRepository.create({
        ...createPeriodDetailDto,
        period,
      });

      const savedPeriodDetail = await this.periodDetailRepository.save(periodDetail);

      return {
        success: true,
        message: 'Period detail created successfully',
        data: savedPeriodDetail,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error creating period detail: ${error.message}`,
        data: null,
      };
    }
  }

  async findAll() {
    try {
      const periodDetails = await this.periodDetailRepository.find({
        relations: ['period'],
      });

      return {
        success: true,
        message: 'Period details retrieved successfully',
        data: periodDetails,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error retrieving period details: ${error.message}`,
        data: null,
      };
    }
  }

  async findOne(id: number) {
    try {
      const periodDetail = await this.periodDetailRepository.findOne({
        where: { id },
        relations: ['period'],
      });

      if (!periodDetail) {
        return {
          success: false,
          message: `Period detail with ID ${id} not found`,
          data: null,
        };
      }

      return {
        success: true,
        message: 'Period detail retrieved successfully',
        data: periodDetail,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error retrieving period detail: ${error.message}`,
        data: null,
      };
    }
  }

  async findByPeriod(periodId: number) {
    try {
      const periodDetails = await this.periodDetailRepository.find({
        where: { period: { id: periodId } },
        order: { startDate: 'ASC' },
      });

      return {
        success: true,
        message: 'Period details retrieved successfully',
        data: periodDetails,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error retrieving period details: ${error.message}`,
        data: null,
      };
    }
  }

  async findActivePeriod(periodId: number) {
    try {
      const currentDate = new Date();
      const activePeriod = await this.periodDetailRepository.findOne({
        where: {
          period: { id: periodId },
          startDate: LessThanOrEqual(currentDate),
          endDate: MoreThanOrEqual(currentDate),
          status: 'active',
        },
      });

      if (!activePeriod) {
        return {
          success: false,
          message: 'No active period found',
          data: null,
        };
      }

      return {
        success: true,
        message: 'Active period retrieved successfully',
        data: activePeriod,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error retrieving active period: ${error.message}`,
        data: null,
      };
    }
  }

  async update(id: number, updatePeriodDetailDto: UpdatePerioDetaildDto) {
    try {
      const periodDetail = await this.periodDetailRepository.findOne({
        where: { id },
      });

      if (!periodDetail) {
        return {
          success: false,
          message: `Period detail with ID ${id} not found`,
          data: null,
        };
      }

      const updated = await this.periodDetailRepository.save({
        ...periodDetail,
        ...updatePeriodDetailDto,
      });

      return {
        success: true,
        message: 'Period detail updated successfully',
        data: updated,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error updating period detail: ${error.message}`,
        data: null,
      };
    }
  }

  async updateStatus(id: number, status: string) {
    try {
      const periodDetail = await this.periodDetailRepository.findOne({
        where: { id },
      });

      if (!periodDetail) {
        return {
          success: false,
          message: `Period detail with ID ${id} not found`,
          data: null,
        };
      }

      periodDetail.status = status;
      const updated = await this.periodDetailRepository.save(periodDetail);

      return {
        success: true,
        message: 'Period detail status updated successfully',
        data: updated,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error updating period detail status: ${error.message}`,
        data: null,
      };
    }
  }

  async remove(id: number) {
    try {
      const periodDetail = await this.periodDetailRepository.findOne({
        where: { id },
      });

      if (!periodDetail) {
        return {
          success: false,
          message: `Period detail with ID ${id} not found`,
          data: null,
        };
      }

      await this.periodDetailRepository.remove(periodDetail);

      return {
        success: true,
        message: 'Period detail deleted successfully',
        data: periodDetail,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error deleting period detail: ${error.message}`,
        data: null,
      };
    }
  }

   async togglePeriodState(closeId?: number, activeId?: number) {
    console.log('closeId:', closeId, 'activeId:', activeId)
    try {
      const updates = [];

      const vaidatStudenGrade = await this.studentGradeRepository.findOne({
        where: {
          periodDetail: { id: closeId},
          status: false,
        },
      });

      if(vaidatStudenGrade){
        return {
          success: false,
          message: `No se puede cerrar el periodo porque existen estudiantes con notas en sesión`,
          data: null
        };
      }

      if (closeId) {
        const closePeriod = await this.periodDetailRepository.findOne({
          where: { id: closeId },
          relations: ['period']
        });

        if (!closePeriod) {
          return {
            success: false,
            message: `Periodo con ID ${closeId} no encontrado`,
            data: null
          };
        }

        closePeriod.status = 'closed';
        const closedPeriod = await this.periodDetailRepository.save(closePeriod);
        updates.push(closedPeriod);
      }

      if (activeId) {
        const activePeriod = await this.periodDetailRepository.findOne({
          where: { id: activeId },
          relations: ['period']
        });

        if (!activePeriod) {
          return {
            success: false,
            message: `Periodo con ID ${activeId} no encontrado`,
            data: null
          };
        }

        activePeriod.status = 'active';
        const activatedPeriod = await this.periodDetailRepository.save(activePeriod);
        updates.push(activatedPeriod);
      }

      if (updates.length === 0) {
        return {
          success: false,
          message: 'No se proporcionaron IDs para actualizar',
          data: null
        };
      }

      return {
        success: true,
        message: 'Estados de periodos actualizados exitosamente',
        data: {
          closedPeriod: updates.find(p => p.id === closeId),
          activatedPeriod: updates.find(p => p.id === activeId)
        }
      };

    } catch (error) {
      console.error('Toggle period state error:', error);
      return {
        success: false,
        message: `Error al actualizar estados de periodos: ${error.message}`,
        data: null
      };
    }
  }
}