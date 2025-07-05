import { Module } from '@nestjs/common';
import { AchievementsService } from './achievements.service';
import { AchievementsController } from './achievements.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Achievement } from './entities/achievement.entity';
import { AchievementDetail } from '../achievement-details/entities/achievement-detail.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Achievement, AchievementDetail])],
  controllers: [AchievementsController],
  providers: [AchievementsService],
})
export class AchievementsModule {}
