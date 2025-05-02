import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { PeriodDetail } from './entities/period-detail.entity';
import { Period } from '../periods/entities/period.entity';
import { CreatePeriodDetailDto } from './dto/create-period-detail.dto';
import { UpdatePerioDetaildDto } from './dto/update-period-detail.dto';

@Injectable()
export class PeriodDetailsService {
  constructor(
    @InjectRepository(PeriodDetail)
    private readonly periodDetailRepository: Repository<PeriodDetail>,
    @InjectRepository(Period)
    private readonly periodRepository: Repository<Period>,
  ) {}

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
}