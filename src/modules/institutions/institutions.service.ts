import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Institution } from './entities/institution.entity';
import { CreateInstitutionDto } from './dto/create-institution.dto';
import { UpdateInstitutionDto } from './dto/update-institution.dto';

@Injectable()
export class InstitutionsService {
  constructor(
    @InjectRepository(Institution)
    private readonly institutionRepository: Repository<Institution>,
  ) {}

  async create(createInstitutionDto: CreateInstitutionDto): Promise<Institution> {
    const institution = this.institutionRepository.create(createInstitutionDto);
    return await this.institutionRepository.save(institution);
  }

  async findAll(): Promise<Institution[]> {
    return await this.institutionRepository.find();
  }

  async findOne(id: number): Promise<Institution> {
    const institution = await this.institutionRepository.findOne({ where: { id } });
    if (!institution) {
      throw new NotFoundException(`Institución con ID ${id} no encontrada`);
    }
    return institution;
  }

  async update(id: number, updateInstitutionDto: UpdateInstitutionDto): Promise<Institution> {
    const institution = await this.findOne(id);
    const updated = Object.assign(institution, updateInstitutionDto);
    return await this.institutionRepository.save(updated);
  }
  

  async remove(id: number): Promise<{ success: boolean; message: string; data: any }> {
    try {
      // Find institution and load relations
      const institution = await this.institutionRepository.findOne({
        where: { id },
        relations: ['headquarters']
      });

      if (!institution) {
        return {
          success: false,
          message: `Institution with ID ${id} not found`,
          data: null
        };
      }

      // Check for related headquarters
      if (institution.headquarters && institution.headquarters.length > 0) {
        return {
          success: false,
          message: `Cannot delete institution. It has ${institution.headquarters.length} associated headquarters`,
          data: null
        };
      }

      await this.institutionRepository.remove(institution);

      return {
        success: true,
        message: `Institution with ID ${id} successfully deleted`,
        data: institution
      };

    } catch (error) {
      return {
        success: false,
        message: `Error deleting institution: ${error.message}`,
        data: null
      };
    }
  }
}
