import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdministratorType } from './entities/administrator-type.entity';
import { CreateAdministratorTypeDto } from './dto/create-administrator-type.dto';
import { UpdateAdministratorTypeDto } from './dto/update-administrator-type.dto';

@Injectable()
export class AdministratorTypeService {
  constructor(
    @InjectRepository(AdministratorType)
    private readonly administratorTypeRepository: Repository<AdministratorType>,
  ) {}

  async create(createAdministratorTypeDto: CreateAdministratorTypeDto) {
    try {
      const administratorType = this.administratorTypeRepository.create(createAdministratorTypeDto);
      const savedType = await this.administratorTypeRepository.save(administratorType);

      return {
        success: true,
        message: 'Administrator type created successfully',
        data: savedType,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error creating administrator type: ${error.message}`,
        data: null,
      };
    }
  }

  async findAll() {
    try {
      const types = await this.administratorTypeRepository.find();
      return {
        success: true,
        message: 'Administrator types retrieved successfully',
        data: types,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error retrieving administrator types: ${error.message}`,
        data: null,
      };
    }
  }

  async findOne(id: number) {
    try {
      const type = await this.administratorTypeRepository.findOne({
        where: { id },
      });

      if (!type) {
        return {
          success: false,
          message: `Administrator type with ID ${id} not found`,
          data: null,
        };
      }

      return {
        success: true,
        message: 'Administrator type retrieved successfully',
        data: type,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error retrieving administrator type: ${error.message}`,
        data: null,
      };
    }
  }

  async update(id: number, updateAdministratorTypeDto: UpdateAdministratorTypeDto) {
    try {
      const type = await this.administratorTypeRepository.findOne({
        where: { id },
      });

      if (!type) {
        return {
          success: false,
          message: `Administrator type with ID ${id} not found`,
          data: null,
        };
      }

      const updated = await this.administratorTypeRepository.save({
        ...type,
        ...updateAdministratorTypeDto,
      });

      return {
        success: true,
        message: 'Administrator type updated successfully',
        data: updated,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error updating administrator type: ${error.message}`,
        data: null,
      };
    }
  }

  async remove(id: number) {
    try {
      const type = await this.administratorTypeRepository.findOne({
        where: { id },
      });

      if (!type) {
        return {
          success: false,
          message: `Administrator type with ID ${id} not found`,
          data: null,
        };
      }

      await this.administratorTypeRepository.remove(type);

      return {
        success: true,
        message: 'Administrator type deleted successfully',
        data: type,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error deleting administrator type: ${error.message}`,
        data: null,
      };
    }
  }
}