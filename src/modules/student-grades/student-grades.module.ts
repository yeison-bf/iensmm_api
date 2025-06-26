import { Module } from '@nestjs/common';
import { StudentGradesService } from './student-grades.service';
import { StudentGradesController } from './student-grades.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentGrade } from './entities/student-grade.entity';
import { StudentEnrollment } from '../student-enrollment/entities/student-enrollment.entity';
import { AcademicThinkingDetail } from '../academic-thinking/entities/academic-thinking-detail.entity';
import { Period } from '../periods/entities/period.entity';
import { Administrator } from '../administrators/entities/administrator.entity';
import { PeriodDetail } from '../period-details/entities/period-detail.entity';
import { PeriodDetailsModule } from '../period-details/period-details.module';
import { Degree } from '../degrees/entities/degree.entity';
import { Group } from '../group/entities/group.entity';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StudentGrade,
      StudentEnrollment,
      AcademicThinkingDetail,
      PeriodDetail,
      Administrator,
      Degree,
      Group
    ]),
    PeriodDetailsModule,
    MailModule
  ],
  controllers: [StudentGradesController],
  providers: [StudentGradesService],
  exports: [StudentGradesService]
})
export class StudentGradesModule {}
