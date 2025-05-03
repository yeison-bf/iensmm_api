import { Module } from '@nestjs/common';
import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { Student } from './entities/student.entity';
import { Attendant } from '../attendants/entities/attendant.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Student, Attendant]),
    UsersModule
  ],
  controllers: [StudentsController],
  providers: [StudentsService],
  exports: [StudentsService, TypeOrmModule]
})
export class StudentsModule {}
