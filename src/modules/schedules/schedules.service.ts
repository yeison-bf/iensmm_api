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
  ) {}

  async create(dto: CreateScheduleDto): Promise<Schedule> {
    const degree = await this.degreeRepo.findOneBy({ id: dto.degreeId });
    if (!degree) throw new NotFoundException('Degree not found');

    const schedule = this.scheduleRepo.create({
      urlImagen: dto.urlImagen,
      anio: dto.anio,
      degree,
    });

    return this.scheduleRepo.save(schedule);
  }

  findAll(): Promise<Schedule[]> {
    return this.scheduleRepo.find();
  }

  async findOne(id: number): Promise<Schedule> {
    const schedule = await this.scheduleRepo.findOne({ where: { id } });
    if (!schedule) throw new NotFoundException('Schedule not found');
    return schedule;
  }

  async update(id: number, dto: UpdateScheduleDto): Promise<Schedule> {
    const schedule = await this.findOne(id);
    if (dto.degreeId) {
      const degree = await this.degreeRepo.findOneBy({ id: dto.degreeId });
      if (!degree) throw new NotFoundException('Degree not found');
      schedule.degree = degree;
    }

    Object.assign(schedule, dto);
    return this.scheduleRepo.save(schedule);
  }

  async remove(id: number): Promise<void> {
    const result = await this.scheduleRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException('Schedule not found');
  }
}
