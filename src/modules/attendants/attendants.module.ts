import { Module } from '@nestjs/common';
import { AttendantsService } from './attendants.service';
import { AttendantsController } from './attendants.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentsModule } from '../students/students.module';
import { Attendant } from './entities/attendant.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Attendant]),
    StudentsModule
  ],
  controllers: [AttendantsController],
  providers: [AttendantsService],
  exports: [AttendantsService, TypeOrmModule]
})
export class AttendantsModule {}
