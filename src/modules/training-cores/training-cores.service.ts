import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TrainingCore } from './entities/training-core.entity';
import { CreateTrainingCoreDto } from './dto/create-training-core.dto';
import { UpdateTrainingCoreDto } from './dto/update-training-core.dto';

@Injectable()
export class TrainingCoresService {
  constructor(
    @InjectRepository(TrainingCore)
    private readonly trainingCoreRepository: Repository<TrainingCore>,
  ) {}

  async create(createTrainingCoreDto: CreateTrainingCoreDto) {
    try {
      const trainingCore = this.trainingCoreRepository.create(createTrainingCoreDto);
      const savedTrainingCore = await this.trainingCoreRepository.save(trainingCore);

      return {
        success: true,
        message: 'Training core created successfully',
        data: savedTrainingCore,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error creating training core: ${error.message}`,
        data: null,
      };
    }
  }

  async findAll(institution?: number) {
    try {
      const where = institution ? { institution } : {};

      const trainingCores = await this.trainingCoreRepository.find({
        where,
        order: { name: 'ASC' },
      });

      return {
        success: true,
        message: 'Training cores retrieved successfully',
        data: trainingCores,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error retrieving training cores: ${error.message}`,
        data: null,
      };
    }
  }

  async findOne(id: number) {
    try {
      const trainingCore = await this.trainingCoreRepository.findOne({
        where: { id },
      });

      if (!trainingCore) {
        return {
          success: false,
          message: 'Training core not found',
          data: null,
        };
      }

      return {
        success: true,
        message: 'Training core retrieved successfully',
        data: trainingCore,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error retrieving training core: ${error.message}`,
        data: null,
      };
    }
  }

  async update(id: number, updateTrainingCoreDto: UpdateTrainingCoreDto) {
    try {
      const trainingCore = await this.trainingCoreRepository.findOne({
        where: { id },
      });

      if (!trainingCore) {
        return {
          success: false,
          message: 'Training core not found',
          data: null,
        };
      }

      const updatedTrainingCore = await this.trainingCoreRepository.save({
        ...trainingCore,
        ...updateTrainingCoreDto,
      });

      return {
        success: true,
        message: 'Training core updated successfully',
        data: updatedTrainingCore,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error updating training core: ${error.message}`,
        data: null,
      };
    }
  }

  async remove(id: number) {
    try {
      const trainingCore = await this.trainingCoreRepository.findOne({
        where: { id },
      });

      if (!trainingCore) {
        return {
          success: false,
          message: 'Training core not found',
          data: null,
        };
      }

      await this.trainingCoreRepository.remove(trainingCore);

      return {
        success: true,
        message: 'Training core deleted successfully',
        data: trainingCore,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error deleting training core: ${error.message}`,
        data: null,
      };
    }
  }
}