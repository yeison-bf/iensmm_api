import { Module } from '@nestjs/common';
import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { Student } from './entities/student.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Student]),
    UsersModule
  ],
  controllers: [StudentsController],
  providers: [StudentsService],
  exports: [StudentsService, TypeOrmModule]
})
export class StudentsModule {}
