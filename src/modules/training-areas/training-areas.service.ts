import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TrainingArea } from './entities/training-area.entity';
import { CreateTrainingAreaDto } from './dto/create-training-area.dto';
import { UpdateTrainingAreaDto } from './dto/update-training-area.dto';
import { TrainingCore } from '../training-cores/entities/training-core.entity';

@Injectable()
export class TrainingAreasService {
  constructor(
    @InjectRepository(TrainingArea)
    private readonly trainingAreaRepository: Repository<TrainingArea>,
    @InjectRepository(TrainingCore)
    private readonly trainingCoreRepository: Repository<TrainingCore>,
  ) {}

  async create(createTrainingAreaDto: CreateTrainingAreaDto) {
    try {
      const trainingCore = await this.trainingCoreRepository.findOne({
        where: { id: createTrainingAreaDto.trainingCoreId },
      });

      if (!trainingCore) {
        return {
          success: false,
          message: 'Training core not found',
          data: null,
        };
      }

      const trainingArea = this.trainingAreaRepository.create(createTrainingAreaDto);
      const savedTrainingArea = await this.trainingAreaRepository.save(trainingArea);

      return {
        success: true,
        message: 'Training area created successfully',
        data: savedTrainingArea,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error creating training area: ${error.message}`,
        data: null,
      };
    }
  }

  async findAll() {
    try {
      const trainingAreas = await this.trainingAreaRepository.find({
        relations: ['trainingCore'],
        order: { name: 'ASC' },
      });

      return {
        success: true,
        message: 'Training areas retrieved successfully',
        data: trainingAreas,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error retrieving training areas: ${error.message}`,
        data: null,
      };
    }
  }

  async findOne(id: number) {
    try {
      const trainingArea = await this.trainingAreaRepository.findOne({
        where: { id },
        relations: ['trainingCore'],
      });

      if (!trainingArea) {
        return {
          success: false,
          message: 'Training area not found',
          data: null,
        };
      }

      return {
        success: true,
        message: 'Training area retrieved successfully',
        data: trainingArea,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error retrieving training area: ${error.message}`,
        data: null,
      };
    }
  }

   async update(id: number, updateTrainingAreaDto: UpdateTrainingAreaDto) {
    try {
      const trainingArea = await this.trainingAreaRepository.findOne({
        where: { id },
        relations: ['trainingCore']
      });

      if (!trainingArea) {
        return {
          success: false,
          message: `Training Area with ID ${id} not found`,
          data: null,
        };
      }

      let trainingCore = null;
      if (updateTrainingAreaDto.trainingCoreId) {
        trainingCore = await this.trainingCoreRepository.findOne({
          where: { id: updateTrainingAreaDto.trainingCoreId },
        });

        if (!trainingCore) {
          return {
            success: false,
            message: `Training Core with ID ${updateTrainingAreaDto.trainingCoreId} not found`,
            data: null,
          };
        }
      }

      const updatedTrainingArea = await this.trainingAreaRepository.save({
        ...trainingArea,
        ...updateTrainingAreaDto,
        trainingCore: trainingCore || trainingArea.trainingCore,
      });

      // Fetch fresh data to return
      const result = await this.trainingAreaRepository.findOne({
        where: { id: updatedTrainingArea.id },
        relations: ['trainingCore']
      });

      return {
        success: true,
        message: 'Training area updated successfully',
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error updating training area: ${error.message}`,
        data: null,
      };
    }
  }


  
  async remove(id: number) {
    try {
      const trainingArea = await this.trainingAreaRepository.findOne({
        where: { id },
        relations: ['trainingCore'],
      });

      if (!trainingArea) {
        return {
          success: false,
          message: 'Training area not found',
          data: null,
        };
      }

      await this.trainingAreaRepository.remove(trainingArea);

      return {
        success: true,
        message: 'Training area deleted successfully',
        data: trainingArea,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error deleting training area: ${error.message}`,
        data: null,
      };
    }
  }
}