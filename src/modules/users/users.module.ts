import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { RolesModule } from '../roles/roles.module';
import { DocumentTypeModule } from '../document-type/document-type.module';
import { HeadquartersModule } from '../headquarters/headquarters.module';
import { Headquarters } from '../headquarters/entities/headquarters.entity';
import { Role } from '../roles/entities/role.entity';
import { DocumentType } from '../document-type/entities/document-type.entity';
import { Student } from '../students/entities/student.entity';
import { Administrator } from '../administrators/entities/administrator.entity';
import { StudentEnrollmentModule } from '../student-enrollment/student-enrollment.module';
import { Degree } from '../degrees/entities/degree.entity';
import { Group } from '../group/entities/group.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Headquarters, Role, DocumentType, Student, Administrator, Degree, Group]),
    StudentEnrollmentModule,
    RolesModule,
    DocumentTypeModule,
    HeadquartersModule

  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService, TypeOrmModule]
})
export class UsersModule {}
