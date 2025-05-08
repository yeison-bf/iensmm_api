import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Headquarters } from './entities/headquarters.entity';
import { CreateHeadquartersDto } from './dto/create-headquarters.dto';
import { UpdateHeadquartersDto } from './dto/update-headquarters.dto';
import { Institution } from '../institutions/entities/institution.entity';

@Injectable()
export class HeadquartersService {
  constructor(
    @InjectRepository(Headquarters)
    private readonly headquartersRepository: Repository<Headquarters>,
    @InjectRepository(Institution)
    private readonly institutionRepository: Repository<Institution>,
  ) { }

  async create(createHeadquartersDto: CreateHeadquartersDto) {
    try {
      // Check if institution exists
      const institution = await this.institutionRepository.findOne({
        where: { id: createHeadquartersDto.institutionId },
      });

      if (!institution) {
        return {
          success: false,
          message: 'Institution not found',
          data: null,
        };
      }

      // Check if codigoDane already exists
      const existingHeadquarters = await this.headquartersRepository.findOne({
        where: { daneCode: createHeadquartersDto.daneCode },
      });

      if (existingHeadquarters) {
        return {
          success: false,
          message: 'Headquarters with this codigoDane already exists',
          data: null,
        };
      }

      const headquarters = this.headquartersRepository.create({
        ...createHeadquartersDto,
        institution: institution,
      });

      const savedHeadquarters = await this.headquartersRepository.save(headquarters);

      return {
        success: true,
        message: 'Headquarters created successfully',
        data: savedHeadquarters,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error creating headquarters: ${error.message}`,
        data: null,
      };
    }
  }



  async findAll(institutionId?: number) {
    try {
      const queryOptions: any = {
        relations: ['institution'],
      };

      if (institutionId) {
        queryOptions.where = {
          institution: { id: institutionId }
        };
      }

      const headquarters = await this.headquartersRepository.find(queryOptions);

      return {
        success: true,
        message: 'Headquarters retrieved successfully',
        data: headquarters,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error retrieving headquarters: ${error.message}`,
        data: null,
      };
    }
  }

  async findOne(id: number) {
    try {
      const headquarters = await this.headquartersRepository.findOne({
        where: { id },
        relations: ['institution'],
      });

      if (!headquarters) {
        return {
          success: false,
          message: `Headquarters with ID ${id} not found`,
          data: null,
        };
      }

      return {
        success: true,
        message: 'Headquarters retrieved successfully',
        data: headquarters,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error retrieving headquarters: ${error.message}`,
        data: null,
      };
    }
  }


  async findOneDaneCode(id: string, institutionId?: number) {
    try {
      const headquarters = await this.headquartersRepository.findOne({
        where: { daneCode: id, institution: { id: institutionId } },
        relations: ['institution'],
      });

      if (!headquarters) {
        return {
          success: false,
          message: `Headquarters with ID ${id} not found`,
          data: null,
        };
      }

      return {
        success: true,
        message: 'Headquarters retrieved successfully',
        data: headquarters,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error retrieving headquarters: ${error.message}`,
        data: null,
      };
    }
  }




  async findOneEmail(id: string, institutionId?: number) {
    try {
      const headquarters = await this.headquartersRepository.findOne({
        where: { email: id, institution: { id: institutionId } },
        relations: ['institution'],
      });

      if (!headquarters) {
        return {
          success: false,
          message: `Headquarters with ID ${id} not found`,
          data: null,
        };
      }

      return {
        success: true,
        message: 'Headquarters retrieved successfully',
        data: headquarters,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error retrieving headquarters: ${error.message}`,
        data: null,
      };
    }
  }




  async update(id: number, updateHeadquartersDto: UpdateHeadquartersDto) {
    try {
      const headquarters = await this.headquartersRepository.findOne({
        where: { id },
      });

      if (!headquarters) {
        return {
          success: false,
          message: `Headquarters with ID ${id} not found`,
          data: null,
        };
      }

      if (updateHeadquartersDto.institutionId) {
        const institution = await this.institutionRepository.findOne({
          where: { id: updateHeadquartersDto.institutionId },
        });

        if (!institution) {
          return {
            success: false,
            message: 'Institution not found',
            data: null,
          };
        }
      }

      const updated = await this.headquartersRepository.save({
        ...headquarters,
        ...updateHeadquartersDto,
      });

      return {
        success: true,
        message: 'Headquarters updated successfully',
        data: updated,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error updating headquarters: ${error.message}`,
        data: null,
      };
    }
  }

  async remove(id: number) {
    try {
      const headquarters = await this.headquartersRepository.findOne({
        where: { id },
      });

      if (!headquarters) {
        return {
          success: false,
          message: `Headquarters with ID ${id} not found`,
          data: null,
        };
      }

      await this.headquartersRepository.remove(headquarters);

      return {
        success: true,
        message: 'Headquarters deleted successfully',
        data: headquarters,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error deleting headquarters: ${error.message}`,
        data: null,
      };
    }
  }
}