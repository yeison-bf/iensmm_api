import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Period } from './entities/period.entity';
import { Institution } from '../institutions/entities/institution.entity';
import { CreatePeriodDto } from './dto/create-period.dto';
import { UpdatePeriodDto } from './dto/update-period.dto';
import { PeriodDetail } from '../period-details/entities/period-detail.entity';

@Injectable()
export class PeriodsService {
  constructor(
    @InjectRepository(Period)
    private readonly periodRepository: Repository<Period>,
    @InjectRepository(Institution)
    private readonly institutionRepository: Repository<Institution>,
    @InjectRepository(PeriodDetail)
    private readonly periodDetailRepository: Repository<PeriodDetail>,
  ) {}
async create(createPeriodDto: CreatePeriodDto) {
    try {
      const institution = await this.institutionRepository.findOne({
        where: { id: createPeriodDto.institutionId },
      });

      if (!institution) {
        return {
          success: false,
          message: 'Institution not found',
          data: null,
        };
      }

      // Create period with its details
      const period = this.periodRepository.create({
        year: createPeriodDto.year,
        periodsQuantity: createPeriodDto.periodsQuantity,
        institution,
        programId:createPeriodDto.programId,
      });

      // Save the period first
      const savedPeriod = await this.periodRepository.save(period);

      // Create period details with new validation
      if (createPeriodDto.periodDetails && createPeriodDto.periodDetails.length > 0) {
        const expectedLength = createPeriodDto.periodsQuantity + 1;
        if (createPeriodDto.periodDetails.length !== expectedLength) {
          return {
            success: false,
            message: `Number of period details must be exactly ${expectedLength} (periodsQuantity + 1)`,
            data: null,
          };
        }

        const periodDetailsPromises = createPeriodDto.periodDetails.map(detail => {
          const periodDetail = this.periodDetailRepository.create({
            ...detail,
            period: savedPeriod,
          });
          return this.periodDetailRepository.save(periodDetail);
        });

        await Promise.all(periodDetailsPromises);
      }

      // Fetch the complete period with details
      const completePeriod = await this.periodRepository.findOne({
        where: { id: savedPeriod.id },
        relations: ['periodDetails', 'institution'],
      });

      return {
        success: true,
        message: 'Period and details created successfully',
        data: completePeriod,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error creating period: ${error.message}`,
        data: null,
      };
    }
}

  async findAll(institutionId?: number, programId?: number) {
    try {
      let where: any = {};
      
      if (institutionId) {
        where.institution = { id: institutionId };
      }
      
      if (programId) {
        where.programId = programId ;
      }

      const periods = await this.periodRepository.find({
        where: where,
        relations: ['institution', 'periodDetails']
      });

      return {
        success: true,
        message: 'Periods retrieved successfully',
        data: periods,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error retrieving periods: ${error.message}`,
        data: null,
      };
    }
  }

  async findOne(id: number) {
    try {
      const period = await this.periodRepository.findOne({
        where: { id },
        relations: ['institution', 'periodDetails'],
      });

      if (!period) {
        return {
          success: false,
          message: `Period with ID ${id} not found`,
          data: null,
        };
      }

      return {
        success: true,
        message: 'Period retrieved successfully',
        data: period,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error retrieving period: ${error.message}`,
        data: null,
      };
    }
  }

  async findOneYear(year: number, institutionId: number) {
    try {
      const period = await this.periodRepository.findOne({
        where: {
          year: year,
          institution: { id: institutionId }
        },
      });

      if (!period) {
        return {
          success: false,
          message: `Period with year ${year} and institution ID ${institutionId} not found`,
          data: null,
        };
      }

      return {
        success: true,
        message: 'Period retrieved successfully',
        data: period,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error retrieving period: ${error.message}`,
        data: null,
      };
    }
  }


  async findByInstitution(institutionId: number) {
    try {
      const periods = await this.periodRepository.find({
        where: { institution: { id: institutionId } },
        relations: ['periodDetails'],
      });

      return {
        success: true,
        message: 'Periods retrieved successfully',
        data: periods,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error retrieving periods: ${error.message}`,
        data: null,
      };
    }
  }

  async update(id: number, updatePeriodDto: UpdatePeriodDto) {
    try {
      const period = await this.periodRepository.findOne({
        where: { id },
      });

      if (!period) {
        return {
          success: false,
          message: `Period with ID ${id} not found`,
          data: null,
        };
      }

      const updated = await this.periodRepository.save({
        ...period,
        ...updatePeriodDto,
      });

      return {
        success: true,
        message: 'Period updated successfully',
        data: updated,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error updating period: ${error.message}`,
        data: null,
      };
    }
  }

  async remove(id: number) {
    try {
      const period = await this.periodRepository.findOne({
        where: { id },
        relations: ['periodDetails'],
      });

      if (!period) {
        return {
          success: false,
          message: `Period with ID ${id} not found`,
          data: null,
        };
      }

      // First remove all period details
      if (period.periodDetails && period.periodDetails.length > 0) {
        await this.periodDetailRepository.remove(period.periodDetails);
      }

      // Then remove the period
      await this.periodRepository.remove(period);

      return {
        success: true,
        message: 'Period and all its details deleted successfully',
        data: period,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error deleting period: ${error.message}`,
        data: null,
      };
    }
  }
}