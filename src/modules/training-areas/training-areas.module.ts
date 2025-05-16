import { Module } from '@nestjs/common';
import { TrainingAreasService } from './training-areas.service';
import { TrainingAreasController } from './training-areas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrainingArea } from './entities/training-area.entity';
import { TrainingCore } from '../training-cores/entities/training-core.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TrainingArea, TrainingCore])],
  controllers: [TrainingAreasController],
  providers: [TrainingAreasService],
  exports: [TrainingAreasService]
})
export class TrainingAreasModule {}
