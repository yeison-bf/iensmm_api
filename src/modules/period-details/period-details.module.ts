import { Module } from '@nestjs/common';
import { PeriodDetailsController } from './period-details.controller';
import { PeriodDetailsService } from './period-details.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PeriodsModule } from '../periods/periods.module';
import { PeriodDetail } from './entities/period-detail.entity';
import { Period } from '../periods/entities/period.entity';
import { StudentGrade } from '../student-grades/entities/student-grade.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PeriodDetail, Period, StudentGrade]),
    PeriodsModule
  ],
  controllers: [PeriodDetailsController],
  providers: [PeriodDetailsService],
  exports: [PeriodDetailsService, TypeOrmModule]
})
export class PeriodDetailsModule {}
