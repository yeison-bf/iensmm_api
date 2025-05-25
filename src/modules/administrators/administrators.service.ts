import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Administrator } from './entities/administrator.entity';
import { CreateAdministratorDto } from './dto/create-administrator.dto';
import { UpdateAdministratorDto } from './dto/update-administrator.dto';

@Injectable()
export class AdministratorsService {
  constructor(
    @InjectRepository(Administrator)
    private readonly administratorRepository: Repository<Administrator>,
  ) {}

  async create(createAdministratorDto: CreateAdministratorDto) {
    try {
      const administrator = this.administratorRepository.create(createAdministratorDto);
      const savedAdmin = await this.administratorRepository.save(administrator);

      const completeAdmin = await this.administratorRepository.findOne({
        where: { id: savedAdmin.id },
        relations: ['user', 'administratorType'],
      });

      return {
        success: true,
        message: 'Administrator created successfully',
        data: completeAdmin,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error creating administrator: ${error.message}`,
        data: null,
      };
    }
  }
  async findAll(institutionId?: number) {
    try {
      const queryBuilder = this.administratorRepository
        .createQueryBuilder('administrator')
        .leftJoinAndSelect('administrator.user', 'user')
        .leftJoinAndSelect('administrator.administratorTypes', 'administratorTypes');

      if (institutionId) {
        queryBuilder.where('user.institution = :institutionId', { institutionId });
      }

      const administrators = await queryBuilder.getMany();

      return {
        success: true,
        message: 'Administrators retrieved successfully',
        data: administrators,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error retrieving administrators: ${error.message}`,
        data: null,
      };
    }
  }
  async findOne(id: number) {
    try {
      const administrator = await this.administratorRepository.findOne({
        where: { id },
        relations: ['user', 'administratorType'],
      });

      if (!administrator) {
        return {
          success: false,
          message: `Administrator with ID ${id} not found`,
          data: null,
        };
      }

      return {
        success: true,
        message: 'Administrator retrieved successfully',
        data: administrator,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error retrieving administrator: ${error.message}`,
        data: null,
      };
    }
  }



  




  
  async update(id: number, updateAdministratorDto: UpdateAdministratorDto) {
    try {
      const administrator = await this.administratorRepository.findOne({
        where: { id },
      });

      if (!administrator) {
        return {
          success: false,
          message: `Administrator with ID ${id} not found`,
          data: null,
        };
      }

      const updated = await this.administratorRepository.save({
        ...administrator,
        ...updateAdministratorDto,
      });

      const completeAdmin = await this.administratorRepository.findOne({
        where: { id },
        relations: ['user', 'administratorType'],
      });

      return {
        success: true,
        message: 'Administrator updated successfully',
        data: completeAdmin,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error updating administrator: ${error.message}`,
        data: null,
      };
    }
  }

  async remove(id: number) {
    try {
      const administrator = await this.administratorRepository.findOne({
        where: { id },
      });

      if (!administrator) {
        return {
          success: false,
          message: `Administrator with ID ${id} not found`,
          data: null,
        };
      }

      await this.administratorRepository.remove(administrator);

      return {
        success: true,
        message: 'Administrator deleted successfully',
        data: administrator,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error deleting administrator: ${error.message}`,
        data: null,
      };
    }
  }
}