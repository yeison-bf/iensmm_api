import { Module } from '@nestjs/common';
import { StudentEnrollmentService } from './student-enrollment.service';
import { StudentEnrollmentController } from './student-enrollment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentEnrollment } from './entities/student-enrollment.entity';
import { Student } from '../students/entities/student.entity';
import { Group } from '../group/entities/group.entity';
import { Degree } from '../degrees/entities/degree.entity';

@Module({
  imports: [TypeOrmModule.forFeature([  StudentEnrollment,
    Student,
    Group,
    Degree])],
  controllers: [StudentEnrollmentController],
  providers: [StudentEnrollmentService],
  exports: [StudentEnrollmentService]  // Add this line
})
export class StudentEnrollmentModule {}
