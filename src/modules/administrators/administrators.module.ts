import { Module } from '@nestjs/common';
import { AdministratorsService } from './administrators.service';
import { AdministratorsController } from './administrators.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { Administrator } from './entities/administrator.entity';
import { AdministratorTypeModule } from '../administrator-type/administrator-type.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Administrator]),
    UsersModule,
    AdministratorTypeModule,
  ],
  controllers: [AdministratorsController],
  providers: [AdministratorsService],
  exports: [AdministratorsService],
})
export class AdministratorsModule {}
