import { Module } from '@nestjs/common';
import { AdministratorTypeService } from './administrator-type.service';
import { AdministratorTypeController } from './administrator-type.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdministratorType } from './entities/administrator-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AdministratorType])],
  controllers: [AdministratorTypeController],
  providers: [AdministratorTypeService],
  exports: [AdministratorTypeService],
})
export class AdministratorTypeModule {}
