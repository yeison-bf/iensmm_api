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
  ) { }

   async create(createAcademicThinkingDto: CreateAcademicThinkingDto) {
    try {
      // Verificar áreas de formación
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

      // Crear arrays de sedes y grados a procesar
      const headquartersToProcess = [
        createAcademicThinkingDto.headquarterId,
        ...(createAcademicThinkingDto.additionalHeadquarters || [])
      ];

      const gradesToProcess = [
        createAcademicThinkingDto.gradeId,
        ...(createAcademicThinkingDto.additionalGrades || [])
      ];

      const createdRecords = [];

      // Crear registros para cada combinación de sede y grado
      for (const headquarterId of headquartersToProcess) {
        for (const gradeId of gradesToProcess) {
          const academicThinking = this.academicThinkingRepository.create({
            year: createAcademicThinkingDto.year,
            headquarterId: headquarterId,
            gradeId: gradeId,
            programId: createAcademicThinkingDto.programId,
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

          createdRecords.push(result);
        }
      }

      return {
        success: true,
        message: 'Pensamiento académico creado exitosamente para todas las sedes y grados',
        data: createdRecords,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error al crear el pensamiento académico: ${error.message}`,
        data: null,
      };
    }
  }


















  async findAll(headquarterId?: number, programId?: number) {
    try {
      const academicThinkings = await this.academicThinkingRepository.find({
        where: { headquarterId, programId },
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










  async findAllByDegree(headquarterId?: number, programId?: number, degreeId?: number) {
    try {
      // Construimos el objeto where según los parámetros recibidos
      const where: any = {};
      
      if (headquarterId !== undefined) {
        where.headquarterId = headquarterId;
      }
      
      if (programId !== undefined) {
        where.programId = programId;
      }
      
      if (degreeId !== undefined) {
        // Usamos gradeId que es el nombre real de la columna en la entidad
        where.gradeId = degreeId;
      }
  
      const academicThinkings = await this.academicThinkingRepository.find({
        where: where,
        relations: ['details', 'details.trainingArea', 'degree'],
        order: { year: 'DESC' },
      });
  
      return {
        success: true,
        message: 'Pensums académicos recuperados exitosamente',
        data: academicThinkings,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error al recuperar los Pensums académicos: ${error.message}`,
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
        relations: ['details', 'details.trainingArea'],
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
        programId: updateAcademicThinkingDto.programId,
      });

      await this.academicThinkingRepository.save(academicThinking);

      if (updateAcademicThinkingDto.details) {
        // Mantener un registro de los IDs actualizados
        const updatedDetailIds = new Set();

        // Actualizar o crear detalles
        for (const detailDto of updateAcademicThinkingDto.details) {
          const trainingArea = await this.trainingAreaRepository.findOne({
            where: { id: detailDto.trainingAreaId }
          });

          if (!trainingArea) {
            continue;
          }

          if (detailDto.id) {
            // Actualizar detalle existente
            const existingDetail = academicThinking.details.find(d => d.id === detailDto.id);
            if (existingDetail) {
              Object.assign(existingDetail, {
                hourlyIntensity: detailDto.hourlyIntensity,
                percentage: detailDto.percentage,
                trainingArea: trainingArea,
              });
              await this.academicThinkingDetailRepository.save(existingDetail);
              updatedDetailIds.add(existingDetail.id);
            }
          } else {
            // Crear nuevo detalle
            const newDetail = this.academicThinkingDetailRepository.create({
              hourlyIntensity: detailDto.hourlyIntensity,
              percentage: detailDto.percentage,
              trainingArea: trainingArea,
              academicThinking: academicThinking
            });
            const savedDetail = await this.academicThinkingDetailRepository.save(newDetail);
            updatedDetailIds.add(savedDetail.id);
          }
        }

        // Eliminar solo los detalles que no fueron actualizados y no tienen dependencias
        const detailsToRemove = academicThinking.details.filter(
          detail => !updatedDetailIds.has(detail.id)
        );

        if (detailsToRemove.length > 0) {
          for (const detail of detailsToRemove) {
            // Verificar si hay dependencias antes de eliminar
            const hasAssignments = await this.academicThinkingDetailRepository
              .createQueryBuilder('detail')
              .leftJoin('detail.academicAssignmentDetails', 'assignments')
              .where('detail.id = :id', { id: detail.id })
              .andWhere('assignments.id IS NOT NULL')
              .getCount();

            if (!hasAssignments) {
              await this.academicThinkingDetailRepository.remove(detail);
            }
          }
        }
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


  async search(year?: number | string, gradeId?: number | string, headquarterId?: number | string) {

    console.log(year, gradeId, headquarterId);
    try {
      const where: any = {};
      
      if (year && !isNaN(Number(year))) {
        where.year = Number(year);
      }
      
      if (gradeId && !isNaN(Number(gradeId))) {
        where.gradeId = Number(gradeId);
      }
      
      if (headquarterId && !isNaN(Number(headquarterId))) {
        where.headquarterId = Number(headquarterId);
      }

      const academicThinkings = await this.academicThinkingRepository.find({
        where,
        relations: ['details', 'details.trainingArea', 'degree'],
        order: { year: 'DESC' },
      });


      return {
        success: academicThinkings.length > 0 ? true : false,
        message: academicThinkings.length > 0
          ? 'Registros encontrados exitosamente'
          : 'No se encontraron registros con los filtros proporcionados',
        data: academicThinkings,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error al buscar registros: ${error.message}`,
        data: null,
      };
    }
  }
}