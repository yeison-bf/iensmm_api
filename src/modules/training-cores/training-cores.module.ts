import { Module } from '@nestjs/common';
import { TrainingCoresService } from './training-cores.service';
import { TrainingCoresController } from './training-cores.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrainingCore } from './entities/training-core.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TrainingCore])],
  controllers: [TrainingCoresController],
  providers: [TrainingCoresService],
  exports: [TrainingCoresService]
})
export class TrainingCoresModule {}
