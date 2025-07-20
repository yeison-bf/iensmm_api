import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Schedule } from './entities/schedule.entity';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { Degree } from 'src/modules/degrees/entities/degree.entity';

@Injectable()
export class SchedulesService {
  constructor(
    @InjectRepository(Schedule)
    private readonly scheduleRepo: Repository<Schedule>,

    @InjectRepository(Degree)
    private readonly degreeRepo: Repository<Degree>,
  ) { }

  async create(dto: CreateScheduleDto): Promise<{ success: boolean; data?: Schedule; message?: string }> {
    const degree = await this.degreeRepo.findOneBy({ id: dto.degreeId });
    if (!degree) {
      return { success: false, message: 'Degree not found' };
    }

    const schedule = this.scheduleRepo.create({
      urlImagen: dto.urlImagen,
      anio: dto.anio,
      degree,
    });

    const savedSchedule = await this.scheduleRepo.save(schedule);

    return { success: true, data: savedSchedule };
  }

  findAll(): Promise<Schedule[]> {
    return this.scheduleRepo.find();
  }



  async findOneByDegre(
    degreeId: number,
    year: number,
  ): Promise<{ success: boolean; message?: string; data?: Schedule }> {
    const schedule = await this.scheduleRepo.findOne({
      where: {
        degree: {
          id: degreeId,
        }
      },
    });

    if (!schedule) {
      return { success: false, message: 'Schedule not found' };
    }

    return { success: true, data: schedule };
  }




  async findOne(id: number): Promise<Schedule> {
    const schedule = await this.scheduleRepo.findOne({ where: { id } });
    if (!schedule) throw new NotFoundException('Schedule not found');
    return schedule;
  }

  async update(
    id: number,
    dto: UpdateScheduleDto,
  ): Promise<{ success: boolean; data?: Schedule; message?: string }> {
    const schedule = await this.findOne(id);
    if (!schedule) {
      return { success: false, message: 'Schedule not found' };
    }

    if (dto.degreeId) {
      const degree = await this.degreeRepo.findOneBy({ id: dto.degreeId });
      if (!degree) {
        return { success: false, message: 'Degree not found' };
      }
      schedule.degree = degree;
    }

    Object.assign(schedule, dto);
    const updated = await this.scheduleRepo.save(schedule);

    return { success: true, data: updated };
  }


  async remove(id: number): Promise<void> {
    const result = await this.scheduleRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException('Schedule not found');
  }
}
