import { Module } from '@nestjs/common';
import { PeriodsController } from './periods.controller';
import { PeriodsService } from './periods.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Period } from './entities/period.entity';
import { Institution } from '../institutions/entities/institution.entity';
import { InstitutionsModule } from '../institutions/institutions.module';
import { PeriodDetail } from '../period-details/entities/period-detail.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Period, Institution, PeriodDetail]),
    InstitutionsModule
  ],
  controllers: [PeriodsController],
  providers: [PeriodsService],
  exports: [PeriodsService, TypeOrmModule]
})
export class PeriodsModule {}
