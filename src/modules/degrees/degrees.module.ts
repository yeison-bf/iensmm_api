import { Module } from '@nestjs/common';
import { DegreesService } from './degrees.service';
import { DegreesController } from './degrees.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Degree } from './entities/degree.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Degree])],
  controllers: [DegreesController],
  providers: [DegreesService],
})
export class DegreesModule {}
