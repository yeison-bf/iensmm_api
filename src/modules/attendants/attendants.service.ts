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
      const attendantsToProcess = Array.isArray(createAttendantDto) 
        ? createAttendantDto 
        : [createAttendantDto];

      const results = {
        created: [],
        updated: [],
        errors: []
      };

      // First, validate if student exists
      const student = await this.studentRepository.findOne({
        where: { id: attendantsToProcess[0].studentId },
      });

      if (!student) {
        return {
          success: false,
          message: `Student with ID ${attendantsToProcess[0].studentId} not found`,
          data: null
        };
      }

      for (const attendantData of attendantsToProcess) {
        try {
          // Check if attendant exists in multiple records
          const existingAttendants = await this.attendantRepository.find({
            where: { document: attendantData.document },
            relations: ['student']
          });

          if (existingAttendants.length > 0) {
            // Check if already has relationship with current student
            const hasCurrentStudent = existingAttendants.some(
              att => att.student.id === attendantData.studentId
            );

            if (hasCurrentStudent) {
              // Update existing record for current student
              const currentAttendant = existingAttendants.find(
                att => att.student.id === attendantData.studentId
              );
              const updatedAttendant = await this.attendantRepository.save({
                ...currentAttendant,
                ...attendantData,
                student,
              });
              results.updated.push(updatedAttendant);
            } else {
              // Create new record with same data for new student
              const newAttendant = this.attendantRepository.create({
                ...attendantData,
                student,
              });
              const savedAttendant = await this.attendantRepository.save(newAttendant);
              results.created.push(savedAttendant);
            }

            // Update all other existing records with new data (except student relation)
            for (const existingAttendant of existingAttendants) {
              if (existingAttendant.student.id !== attendantData.studentId) {
                const updatedAttendant = await this.attendantRepository.save({
                  ...existingAttendant,
                  firstName: attendantData.firstName,
                  lastName: attendantData.lastName,
                  phone: attendantData.phone,
                  address: attendantData.address,
                  relationship: attendantData.relationship,
                  occupation: attendantData.occupation,
                  email: attendantData.email,
                  documentType: attendantData.documentType,
                  document: attendantData.document,
                  // Mantiene su estudiante original
                  student: existingAttendant.student,
                });
                results.updated.push(updatedAttendant);
              }
            }
          } else {
            // Create new attendant if doesn't exist
            const newAttendant = this.attendantRepository.create({
              ...attendantData,
              student,
            });
            const savedAttendant = await this.attendantRepository.save(newAttendant);
            results.created.push(savedAttendant);
          }

        } catch (individualError) {
          results.errors.push({
            data: attendantData,
            message: `Error processing attendant: ${individualError.message}`
          });
        }
      }

      return {
        success: results.errors.length === 0,
        message: `Processed ${attendantsToProcess.length} attendants. Created: ${results.created.length}, Updated: ${results.updated.length}, Errors: ${results.errors.length}`,
        data: {
          created: results.created,
          updated: results.updated,
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