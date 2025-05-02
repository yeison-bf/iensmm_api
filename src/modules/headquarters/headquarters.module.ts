import { Module } from '@nestjs/common';
import { HeadquartersService } from './headquarters.service';
import { HeadquartersController } from './headquarters.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InstitutionsModule } from '../institutions/institutions.module';
import { Headquarters } from './entities/headquarters.entity';
import { Institution } from '../institutions/entities/institution.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Headquarters, Institution]),
    InstitutionsModule
  ],
  controllers: [HeadquartersController],
  providers: [HeadquartersService, TypeOrmModule],
})
export class HeadquartersModule {}
