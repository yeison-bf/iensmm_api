import { Module } from '@nestjs/common';
import { AcademicThinkingService } from './academic-thinking.service';
import { AcademicThinkingController } from './academic-thinking.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AcademicThinking } from './entities/academic-thinking.entity';
import { AcademicThinkingDetail } from './entities/academic-thinking-detail.entity';
import { TrainingArea } from '../training-areas/entities/training-area.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AcademicThinking, AcademicThinkingDetail, TrainingArea])],
  controllers: [AcademicThinkingController],
  providers: [AcademicThinkingService],
})
export class AcademicThinkingModule {}
