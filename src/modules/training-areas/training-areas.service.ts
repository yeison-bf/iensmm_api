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
      let trainingCore = null;
      
      // Solo busca el trainingCore si se proporciona un ID
      if (createTrainingAreaDto.trainingCoreId) {
        trainingCore = await this.trainingCoreRepository.findOneBy({ 
          id: createTrainingAreaDto.trainingCoreId 
        });
  
        if (!trainingCore) {
          return {
            success: false,
            message: `Training core with ID ${createTrainingAreaDto.trainingCoreId} not found`,
            data: null,
          };
        }
      }
  
      const trainingArea = new TrainingArea();
      trainingArea.name = createTrainingAreaDto.name;
      trainingArea.institution = createTrainingAreaDto.institution;
      trainingArea.trainingCoreId = createTrainingAreaDto.trainingCoreId || null; // Asegura null si no viene
      trainingArea.trainingCore = trainingCore; // Puede ser null
      trainingArea.programId = createTrainingAreaDto.programId;
  
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











  

  async findAll(institution?: number, programId?: number) {
    try {
      console.log('institution', institution)
      console.log('programId', programId)

      
      const where = institution ? { institution, programId } : {};
      
      const trainingAreas = await this.trainingAreaRepository.find({
        where,
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
          message: 'Área de formación no encontrada',
          data: null,
        };
      }

      await this.trainingAreaRepository.remove(trainingArea);

      return {
        success: true,
        message: 'Área de formación eliminada exitosamente',
        data: trainingArea,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al eliminar el área de formación',
        data: null,
      };
    }
  }
}