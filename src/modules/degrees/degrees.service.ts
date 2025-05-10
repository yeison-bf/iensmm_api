import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDegreeDto } from './dto/create-degree.dto';
import { UpdateDegreeDto } from './dto/update-degree.dto';
import { Degree } from './entities/degree.entity';

@Injectable()
export class DegreesService {
  constructor(
    @InjectRepository(Degree)
    private readonly degreeRepository: Repository<Degree>,
  ) {}

  async create(createDegreeDto: CreateDegreeDto) {
    try {
      const degree = this.degreeRepository.create(createDegreeDto);
      const savedDegree = await this.degreeRepository.save(degree);

      return {
        success: true,
        message: 'Degree created successfully',
        data: savedDegree,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error creating degree: ${error.message}`,
        data: null,
      };
    }
  }

  async findAll() {
    try {
      const degrees = await this.degreeRepository.find();
      return {
        success: true,
        message: 'Degrees retrieved successfully',
        data: degrees,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error retrieving degrees: ${error.message}`,
        data: null,
      };
    }
  }

  async findOne(id: number) {
    try {
      const degree = await this.degreeRepository.findOne({ where: { id } });
      if (!degree) {
        return {
          success: false,
          message: `Degree with ID ${id} not found`,
          data: null,
        };
      }
      return {
        success: true,
        message: 'Degree retrieved successfully',
        data: degree,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error retrieving degree: ${error.message}`,
        data: null,
      };
    }
  }

  async update(id: number, updateDegreeDto: UpdateDegreeDto) {
    try {
      const degree = await this.degreeRepository.findOne({ where: { id } });
      if (!degree) {
        return {
          success: false,
          message: `Degree with ID ${id} not found`,
          data: null,
        };
      }

      const updated = await this.degreeRepository.save({
        ...degree,
        ...updateDegreeDto,
      });

      return {
        success: true,
        message: 'Degree updated successfully',
        data: updated,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error updating degree: ${error.message}`,
        data: null,
      };
    }
  }

  async remove(id: number) {
    try {
      const degree = await this.degreeRepository.findOne({ where: { id } });
      if (!degree) {
        return {
          success: false,
          message: `Degree with ID ${id} not found`,
          data: null,
        };
      }

      await this.degreeRepository.remove(degree);

      return {
        success: true,
        message: 'Degree deleted successfully',
        data: degree,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error deleting degree: ${error.message}`,
        data: null,
      };
    }
  }
}