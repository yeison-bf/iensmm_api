import { Module } from '@nestjs/common';
import { AchievementDetailsService } from './achievement-details.service';
import { AchievementDetailsController } from './achievement-details.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AchievementDetail } from './entities/achievement-detail.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AchievementDetail])],
  controllers: [AchievementDetailsController],
  providers: [AchievementDetailsService],
})
export class AchievementDetailsModule {}
