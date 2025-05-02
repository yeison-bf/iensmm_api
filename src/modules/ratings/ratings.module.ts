import { Module } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { RatingsController } from './ratings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InstitutionsModule } from '../institutions/institutions.module';
import { Rating } from './entities/rating.entity';
import { Institution } from '../institutions/entities/institution.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Rating, Institution]),
    InstitutionsModule
  ],
  controllers: [RatingsController],
  providers: [RatingsService],
  exports: [RatingsService, TypeOrmModule]

})
export class RatingsModule {}
