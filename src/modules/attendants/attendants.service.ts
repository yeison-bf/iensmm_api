import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendant } from './entities/attendant.entity';
import { CreateAttendantDto } from './dto/create-attendant.dto';
import { Student } from '../students/entities/student.entity';

@Injectable()
export class AttendantsService {
  constructor(
    @InjectRepository(Attendant)
    private readonly attendantRepository: Repository<Attendant>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
  ) {}

  
  async create(createAttendantDto: CreateAttendantDto | CreateAttendantDto[]) {
    try {
      // Convert single object to array if necessary
      const attendantsToCreate = Array.isArray(createAttendantDto) 
        ? createAttendantDto 
        : [createAttendantDto];

      const results = {
        success: [],
        errors: []
      };

      // Process each attendant
      for (const attendantData of attendantsToCreate) {
        try {
          const student = await this.studentRepository.findOne({
            where: { id: attendantData.studentId },
          });

          if (!student) {
            results.errors.push({
              data: attendantData,
              message: `Student with ID ${attendantData.studentId} not found`
            });
            continue;
          }

          const attendant = this.attendantRepository.create({
            ...attendantData,
            student,
          });

          const savedAttendant = await this.attendantRepository.save(attendant);
          results.success.push(savedAttendant);

        } catch (individualError) {
          results.errors.push({
            data: attendantData,
            message: `Error saving attendant: ${individualError.message}`
          });
        }
      }

      return {
        success: results.errors.length === 0,
        message: `Processed ${attendantsToCreate.length} attendants. Success: ${results.success.length}, Errors: ${results.errors.length}`,
        data: {
          successful: results.success,
          failed: results.errors
        }
      };

    } catch (error) {
      return {
        success: false,
        message: `Error processing attendants: ${error.message}`,
        data: null,
      };
    }
  }

  async findAll() {
    try {
      const attendants = await this.attendantRepository.find({
        relations: ['student', 'student.user' ],
      });

      return {
        success: true,
        message: 'Attendants retrieved successfully',
        data: attendants,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error retrieving attendants: ${error.message}`,
        data: null,
      };
    }
  }

  async findOne(id: number) {
    try {
      const attendant = await this.attendantRepository.find({
        where: { student: {id} },
        relations: ['student'],
      });

      if (!attendant) {
        return {
          success: false,
          message: `Attendant with ID ${id} not found`,
          data: null,
        };
      }

      return {
        success: true,
        message: 'Attendant retrieved successfully',
        data: attendant,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error retrieving attendant: ${error.message}`,
        data: null,
      };
    }
  }


 

  async findByStudent(studentId: number) {
    try {
      const attendants = await this.attendantRepository.find({
        where: { student: { id: studentId } },
        relations: ['student'],
      });

      return {
        success: true,
        message: 'Attendants retrieved successfully',
        data: attendants,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error retrieving attendants: ${error.message}`,
        data: null,
      };
    }
  }

  async update(id: number, updateAttendantDto: CreateAttendantDto) {
    try {
      const attendant = await this.attendantRepository.findOne({
        where: { id },
      });

      if (!attendant) {
        return {
          success: false,
          message: `Attendant with ID ${id} not found`,
          data: null,
        };
      }

      const student = await this.studentRepository.findOne({
        where: { id: updateAttendantDto.studentId },
      });

      if (!student) {
        return {
          success: false,
          message: 'Student not found',
          data: null,
        };
      }

      const updatedAttendant = await this.attendantRepository.save({
        ...attendant,
        ...updateAttendantDto,
        student,
      });

      return {
        success: true,
        message: 'Attendant updated successfully',
        data: updatedAttendant,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error updating attendant: ${error.message}`,
        data: null,
      };
    }
  }

  async remove(id: number) {
    try {
      const attendant = await this.attendantRepository.findOne({
        where: { id },
      });

      if (!attendant) {
        return {
          success: false,
          message: `Attendant with ID ${id} not found`,
          data: null,
        };
      }

      await this.attendantRepository.remove(attendant);

      return {
        success: true,
        message: 'Attendant deleted successfully',
        data: attendant,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error deleting attendant: ${error.message}`,
        data: null,
      };
    }
  }
}