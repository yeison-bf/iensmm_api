import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProgramDto } from './dto/create-program.dto';
import { UpdateProgramDto } from './dto/update-program.dto';
import { Program } from './entities/program.entity';

@Injectable()
export class ProgramsService {
  constructor(
    @InjectRepository(Program)
    private readonly programRepository: Repository<Program>,
  ) {}

  async create(createProgramDto: CreateProgramDto) {
    try {
      const program = this.programRepository.create(createProgramDto);
      const savedProgram = await this.programRepository.save(program);

      return {
        success: true,
        message: 'Program created successfully',
        data: savedProgram,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error creating program: ${error.message}`,
        data: null,
      };
    }
  }


  
    async findAll(institutionId?: number) {
    try {
      const queryBuilder = this.programRepository
        .createQueryBuilder('program')
        .leftJoin('program.studentEnrollments', 'enrollments')
        .select([
          'program.id',
          'program.name',
          'program.description',
          'program.institutionId',
          'program.status'
        ])
        .addSelect('COUNT(DISTINCT enrollments.id)', 'enrollmentsCount')
        .groupBy('program.id');

      if (institutionId) {
        queryBuilder.where('program.institutionId = :institutionId', { institutionId });
      }

      const programsRaw = await queryBuilder.getRawAndEntities();

      // Combinar los resultados con los conteos
      const programs = programsRaw.entities.map((program, index) => ({
        ...program,
        enrollmentsCount: parseInt(programsRaw.raw[index].enrollmentsCount) || 0
      }));

      return {
        success: true,
        message: 'Programs retrieved successfully',
        data: programs,
      };
    } catch (error) {
      console.error('Error in findAll programs:', error);
      return {
        success: false,
        message: `Error retrieving programs: ${error.message}`,
        data: null,
      };
    }
  }

  async findOne(id: number) {
    try {
      const program = await this.programRepository.findOne({
        where: { id },
      });

      if (!program) {
        return {
          success: false,
          message: `Program with ID ${id} not found`,
          data: null,
        };
      }

      return {
        success: true,
        message: 'Program retrieved successfully',
        data: program,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error retrieving program: ${error.message}`,
        data: null,
      };
    }
  }

  async update(id: number, updateProgramDto: UpdateProgramDto) {
    try {
      const program = await this.programRepository.findOne({
        where: { id },
      });

      if (!program) {
        return {
          success: false,
          message: `Program with ID ${id} not found`,
          data: null,
        };
      }

      const updatedProgram = await this.programRepository.save({
        ...program,
        ...updateProgramDto,
      });

      return {
        success: true,
        message: 'Program updated successfully',
        data: updatedProgram,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error updating program: ${error.message}`,
        data: null,
      };
    }
  }

  async remove(id: number) {
    try {
      const program = await this.programRepository.findOne({
        where: { id },
        relations: ['administratorTypes'],
      });

      if (!program) {
        return {
          success: false,
          message: `Program with ID ${id} not found`,
          data: null,
        };
      }

      if (program.administratorTypes?.length > 0) {
        return {
          success: false,
          message: 'Cannot delete program: It has associated administrator types',
          data: null,
        };
      }

      await this.programRepository.remove(program);

      return {
        success: true,
        message: 'Program deleted successfully',
        data: program,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error deleting program: ${error.message}`,
        data: null,
      };
    }
  }
}