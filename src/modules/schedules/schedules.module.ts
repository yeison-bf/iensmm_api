import { Module } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { SchedulesController } from './schedules.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Schedule } from './entities/schedule.entity';
import { Degree } from '../degrees/entities/degree.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Schedule, Degree])],
  controllers: [SchedulesController],
  providers: [SchedulesService],
})
export class SchedulesModule { }
