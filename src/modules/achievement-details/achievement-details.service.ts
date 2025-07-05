import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AchievementDetail } from './entities/achievement-detail.entity';
import { CreateAchievementDetailDto } from './dto/create-achievement-detail.dto';
import { UpdateAchievementDetailDto } from './dto/update-achievement-detail.dto';

@Injectable()
export class AchievementDetailsService {
  constructor(
    @InjectRepository(AchievementDetail)
    private readonly achievementDetailRepository: Repository<AchievementDetail>,
  ) {}

  async create(createAchievementDetailDto: CreateAchievementDetailDto) {
    try {
      const detail = this.achievementDetailRepository.create({
        ...createAchievementDetailDto,
        achievement: { id: createAchievementDetailDto.achievementId },
        rating: { id: createAchievementDetailDto.ratingId },
      });

      const savedDetail = await this.achievementDetailRepository.save(detail);

      return {
        success: true,
        message: 'Achievement detail created successfully',
        data: savedDetail,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error creating achievement detail: ${error.message}`,
        data: null,
      };
    }
  }

  async findAll() {
    try {
      const details = await this.achievementDetailRepository.find({
        relations: ['achievement', 'rating'],
      });

      return {
        success: true,
        message: 'Achievement details retrieved successfully',
        data: details,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error retrieving achievement details: ${error.message}`,
        data: null,
      };
    }
  }

  async findOne(id: number) {
    try {
      const detail = await this.achievementDetailRepository.findOne({
        where: { id },
        relations: ['achievement', 'rating'],
      });

      if (!detail) {
        return {
          success: false,
          message: 'Achievement detail not found',
          data: null,
        };
      }

      return {
        success: true,
        message: 'Achievement detail retrieved successfully',
        data: detail,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error retrieving achievement detail: ${error.message}`,
        data: null,
      };
    }
  }

  async update(id: number, updateAchievementDetailDto: UpdateAchievementDetailDto) {
    try {
      const detail = await this.achievementDetailRepository.findOne({
        where: { id },
      });

      if (!detail) {
        return {
          success: false,
          message: 'Achievement detail not found',
          data: null,
        };
      }

      const updatedDetail = await this.achievementDetailRepository.save({
        ...detail,
        ...updateAchievementDetailDto,
        achievement: updateAchievementDetailDto.achievementId ? { id: updateAchievementDetailDto.achievementId } : detail.achievement,
        rating: updateAchievementDetailDto.ratingId ? { id: updateAchievementDetailDto.ratingId } : detail.rating,
      });

      return {
        success: true,
        message: 'Achievement detail updated successfully',
        data: updatedDetail,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error updating achievement detail: ${error.message}`,
        data: null,
      };
    }
  }

  async remove(id: number) {
    try {
      const detail = await this.achievementDetailRepository.findOne({
        where: { id },
      });

      if (!detail) {
        return {
          success: false,
          message: 'Achievement detail not found',
          data: null,
        };
      }

      await this.achievementDetailRepository.remove(detail);

      return {
        success: true,
        message: 'Achievement detail deleted successfully',
        data: detail,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error deleting achievement detail: ${error.message}`,
        data: null,
      };
    }
  }
}