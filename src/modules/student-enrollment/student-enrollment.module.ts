import { Module } from '@nestjs/common';
import { StudentEnrollmentService } from './student-enrollment.service';
import { StudentEnrollmentController } from './student-enrollment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentEnrollment } from './entities/student-enrollment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StudentEnrollment])],
  controllers: [StudentEnrollmentController],
  providers: [StudentEnrollmentService],
})
export class StudentEnrollmentModule {}
