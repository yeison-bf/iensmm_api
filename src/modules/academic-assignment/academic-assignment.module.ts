import { Module } from '@nestjs/common';
import { AcademicAssignmentService } from './academic-assignment.service';
import { AcademicAssignmentController } from './academic-assignment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AcademicAssignment } from './entities/academic-assignment.entity';
import { Administrator } from '../administrators/entities/administrator.entity';
import { AcademicThinkingDetail } from '../academic-thinking/entities/academic-thinking-detail.entity';
import { StudentEnrollment } from '../student-enrollment/entities/student-enrollment.entity';
import { Headquarters } from '../headquarters/entities/headquarters.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AcademicAssignment,
      Headquarters,
      Administrator,
      AcademicThinkingDetail,
      StudentEnrollment
    ])
  ],
  controllers: [AcademicAssignmentController],
  providers: [AcademicAssignmentService],
})
export class AcademicAssignmentModule {}
