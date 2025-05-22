import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AcademicThinking } from './entities/academic-thinking.entity';
import { AcademicThinkingDetail } from './entities/academic-thinking-detail.entity';
import { CreateAcademicThinkingDto } from './dto/create-academic-thinking.dto';
import { UpdateAcademicThinkingDto } from './dto/update-academic-thinking.dto';
import { TrainingArea } from '../training-areas/entities/training-area.entity';

@Injectable()
export class AcademicThinkingService {
  constructor(
    @InjectRepository(AcademicThinking)
    private readonly academicThinkingRepository: Repository<AcademicThinking>,
    @InjectRepository(AcademicThinkingDetail)
    private readonly academicThinkingDetailRepository: Repository<AcademicThinkingDetail>,
    @InjectRepository(TrainingArea)
    private readonly trainingAreaRepository: Repository<TrainingArea>,
  ) {}

  async create(createAcademicThinkingDto: CreateAcademicThinkingDto) {
    try {
      // Verificar que el área de formación exista
      for (const detail of createAcademicThinkingDto.details) {
        const trainingArea = await this.trainingAreaRepository.findOne({
          where: { id: detail.trainingAreaId }
        });
        
        if (!trainingArea) {
          return {
            success: false,
            message: `Área de formación con ID ${detail.trainingAreaId} no encontrada`,
            data: null,
          };
        }
      }

      const academicThinking = this.academicThinkingRepository.create({
        year: createAcademicThinkingDto.year,
        headquarterId: createAcademicThinkingDto.headquarterId,
        gradeId: createAcademicThinkingDto.gradeId,
      });

      const savedAcademicThinking = await this.academicThinkingRepository.save(academicThinking);

      const details = await Promise.all(
        createAcademicThinkingDto.details.map(async detail => {
          const trainingArea = await this.trainingAreaRepository.findOne({
            where: { id: detail.trainingAreaId }
          });
          
          return this.academicThinkingDetailRepository.create({
            hourlyIntensity: detail.hourlyIntensity,
            percentage: detail.percentage,
            trainingArea: trainingArea,
            academicThinking: savedAcademicThinking,
          });
        })
      );

      await this.academicThinkingDetailRepository.save(details);

      const result = await this.academicThinkingRepository.findOne({
        where: { id: savedAcademicThinking.id },
        relations: ['details', 'details.trainingArea', 'details.trainingArea.trainingCore'],
      });

      return {
        success: true,
        message: 'Pensamiento académico creado exitosamente',
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error al crear el pensamiento académico: ${error.message}`,
        data: null,
      };
    }
  }


  async findAll() {
    try {
      const academicThinkings = await this.academicThinkingRepository.find({
        relations: ['details', 'details.trainingArea', 'degree'],
        order: { year: 'DESC' },
      });

      return {
        success: true,
        message: 'Pemsum académicos recuperados exitosamente',
        data: academicThinkings,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error al recuperar los Pemsum académicos: ${error.message}`,
        data: null,
      };
    }
  }

  async findOne(id: number) {
    try {
      const academicThinking = await this.academicThinkingRepository.findOne({
        where: { id },
        relations: ['details', 'details.trainingArea', 'degree'],
      });

      if (!academicThinking) {
        return {
          success: false,
          message: 'Pensamiento académico no encontrado',
          data: null,
        };
      }

      return {
        success: true,
        message: 'Pensamiento académico recuperado exitosamente',
        data: academicThinking,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error al recuperar el pensamiento académico: ${error.message}`,
        data: null,
      };
    }
  }

  async update(id: number, updateAcademicThinkingDto: UpdateAcademicThinkingDto) {
    try {
      const academicThinking = await this.academicThinkingRepository.findOne({
        where: { id },
        relations: ['details'],
      });

      if (!academicThinking) {
        return {
          success: false,
          message: 'Pensamiento académico no encontrado',
          data: null,
        };
      }

      // Update main entity
      Object.assign(academicThinking, {
        year: updateAcademicThinkingDto.year,
        headquarterId: updateAcademicThinkingDto.headquarterId,
        gradeId: updateAcademicThinkingDto.gradeId,
      });

      await this.academicThinkingRepository.save(academicThinking);

      if (updateAcademicThinkingDto.details) {
        // Remove old details
        await this.academicThinkingDetailRepository.remove(academicThinking.details);

        // Create new details with training area references
        const newDetails = await Promise.all(
          updateAcademicThinkingDto.details.map(async detail => {
            const trainingArea = await this.trainingAreaRepository.findOne({
              where: { id: detail.trainingAreaId }
            });

            return this.academicThinkingDetailRepository.create({
              hourlyIntensity: detail.hourlyIntensity,
              percentage: detail.percentage,
              trainingArea: trainingArea,
              academicThinking: academicThinking
            });
          })
        );

        await this.academicThinkingDetailRepository.save(newDetails);
      }

      // Get updated result with relations
      const result = await this.academicThinkingRepository.findOne({
        where: { id },
        relations: ['details', 'details.trainingArea'],
      });

      return {
        success: true,
        message: 'Pensamiento académico actualizado exitosamente',
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error al actualizar el pensamiento académico: ${error.message}`,
        data: null,
      };
    }
  }



  

  async remove(id: number) {
    try {
      const academicThinking = await this.academicThinkingRepository.findOne({
        where: { id },
        relations: ['details'],
      });

      if (!academicThinking) {
        return {
          success: false,
          message: 'Pensamiento académico no encontrado',
          data: null,
        };
      }

      await this.academicThinkingDetailRepository.remove(academicThinking.details);
      await this.academicThinkingRepository.remove(academicThinking);

      return {
        success: true,
        message: 'Pensamiento académico eliminado exitosamente',
        data: academicThinking,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error al eliminar el pensamiento académico: ${error.message}`,
        data: null,
      };
    }
  }
}