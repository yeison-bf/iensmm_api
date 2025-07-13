import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Achievement } from './entities/achievement.entity';
import { CreateAchievementDto } from './dto/create-achievement.dto';
import { UpdateAchievementDto } from './dto/update-achievement.dto';
import { AchievementDetail } from '../achievement-details/entities/achievement-detail.entity';
import { Degree } from '../degrees/entities/degree.entity';

@Injectable()
export class AchievementsService {
  constructor(
    @InjectRepository(Achievement)
    private readonly achievementRepository: Repository<Achievement>,
    @InjectRepository(AchievementDetail)
    private readonly achievementDetailRepository: Repository<AchievementDetail>,
    @InjectRepository(Degree)
    private readonly degreeRepository: Repository<Degree>,
  ) { }

  async create(createAchievementDto: CreateAchievementDto) {
    try {
      // Create the achievement with its relationships
      const achievement = this.achievementRepository.create({
        year: createAchievementDto.year,
        competence: createAchievementDto.competence,
        aspect: createAchievementDto.aspect,
        administrator: { id: createAchievementDto.administratorId },
        degree: { id: createAchievementDto.degreeId },
        trainingArea: { id: createAchievementDto.trainingAreaId },
        periodDetail: { id: createAchievementDto.periodDetailId },
      });

      // Save the achievement first
      const savedAchievement = await this.achievementRepository.save(achievement);

      // If there are details, create them
      if (createAchievementDto.details?.length > 0) {
        const details = createAchievementDto.details.map(detail => ({
          description: detail.description,
          achievement: savedAchievement,
          rating: { id: detail.ratingId }
        }));

        savedAchievement.details = await this.achievementDetailRepository.save(details);
      }

      // Fetch the complete achievement with all relations
      const completeAchievement = await this.achievementRepository
        .createQueryBuilder('achievement')
        .leftJoinAndSelect('achievement.administrator', 'administrator')
        .leftJoinAndSelect('administrator.user', 'user')
        .leftJoinAndSelect('achievement.degree', 'degree')
        .leftJoinAndSelect('achievement.trainingArea', 'trainingArea')
        .leftJoinAndSelect('achievement.periodDetail', 'periodDetail')
        .leftJoinAndSelect('achievement.details', 'details')
        .leftJoinAndSelect('details.rating', 'rating')
        .where('achievement.id = :id', { id: savedAchievement.id })
        .getOne();

      return {
        success: true,
        message: 'Achievement and details created successfully',
        data: completeAchievement,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error creating achievement: ${error.message}`,
        data: null,
      };
    }
  }

  async findAllWithDetails() {
    try {
      const achievements = await this.achievementRepository
        .createQueryBuilder('achievement')
        .leftJoinAndSelect('achievement.administrator', 'administrator')
        .leftJoinAndSelect('administrator.user', 'user')
        .leftJoinAndSelect('achievement.degree', 'degree')
        .leftJoinAndSelect('achievement.trainingArea', 'trainingArea')
        .leftJoinAndSelect('achievement.periodDetail', 'periodDetail')
        .leftJoinAndSelect('achievement.details', 'details')
        .leftJoinAndSelect('details.rating', 'rating')
        .orderBy('achievement.year', 'DESC')
        .addOrderBy('achievement.createdAt', 'DESC')
        .getMany();

      return {
        success: true,
        message: 'Achievements with details retrieved successfully',
        data: achievements,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error retrieving achievements with details: ${error.message}`,
        data: null,
      };
    }
  }
  async findByDegreesAndPeriod(degreeIds: number[], periodDetailId: number, year: number) {
    try {
      const degrees = await this.degreeRepository.find({
        where: { id: In(degreeIds) }
      });

      const achievements = await this.achievementRepository
        .createQueryBuilder('achievement')
        .leftJoinAndSelect('achievement.administrator', 'administrator')
        .leftJoinAndSelect('administrator.user', 'user')
        .leftJoinAndSelect('achievement.degree', 'degree')
        .leftJoinAndSelect('achievement.trainingArea', 'trainingArea')
        .leftJoinAndSelect('achievement.periodDetail', 'periodDetail')
        .leftJoinAndSelect('achievement.details', 'details')
        .leftJoinAndSelect('details.rating', 'rating')
        .where('achievement.degree.id IN (:...degreeIds)', { degreeIds })
        .andWhere('achievement.year = :year', { year })
        .andWhere('achievement.periodDetail.id = :periodDetailId', { periodDetailId })
        .getMany();

      const result = degrees.map(degree => {
        const degreeAchievements = achievements.filter(a => a.degree.id === degree.id);
        
        // Agrupar logros por área de formación
        const groupedByArea = degreeAchievements.reduce((acc, achievement) => {
          const areaId = achievement.trainingArea.id;
          if (!acc[areaId]) {
            acc[areaId] = {
              trainingArea: {
                id: achievement.trainingArea.id,
                name: achievement.trainingArea.name,
              },
              achievements: []
            };
          }
          acc[areaId].achievements.push(achievement);
          return acc;
        }, {});

        return {
          degree: {
            id: degree.id,
            name: degree.name,
          },
          trainingAreas: Object.values(groupedByArea),
          hasAchievements: degreeAchievements.length > 0
        };
      });

      return {
        success: true,
        message: 'Degrees and achievements information retrieved successfully',
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error retrieving achievements: ${error.message}`,
        data: null,
      };
    }
  }

   async findAll(degreeIds: number, year: number, areaId?: number, periodDetailId?: number) {
    try {
      const queryBuilder = this.achievementRepository.createQueryBuilder('achievement')
        .leftJoinAndSelect('achievement.administrator', 'administrator')
        .leftJoinAndSelect('administrator.user', 'user')
        .leftJoinAndSelect('achievement.degree', 'degree')
        .leftJoinAndSelect('achievement.trainingArea', 'trainingArea')
        .leftJoinAndSelect('achievement.periodDetail', 'periodDetail')
        .leftJoinAndSelect('achievement.details', 'details')
        .leftJoinAndSelect('details.rating', 'rating') // Added rating relation
        .where('degree.id = :degreeId', { degreeId: degreeIds })
        .andWhere('achievement.year = :year', { year });

      if (areaId) {
        queryBuilder.andWhere('trainingArea.id = :areaId', { areaId });
      }

      if (periodDetailId) {
        queryBuilder.andWhere('periodDetail.id = :periodDetailId', { periodDetailId });
      }

      const achievements = await queryBuilder.getMany();

      return {
        success: true,
        message: 'Achievements retrieved successfully',
        data: achievements,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error retrieving achievements: ${error.message}`,
        data: null,
      };
    }
  }



  async findOne(id: number, degreeIds: number, periodDetailId: number, year: number) {
    try {
      const achievement = await this.achievementRepository.findOne({
        where: { degree: { id: degreeIds }, periodDetail: { id: periodDetailId }, year: year },
        relations: ['periodDetail', 'details'],
      });

      if (!achievement) {
        return {
          success: false,
          message: 'Achievement not found',
          data: null,
        };
      }

      return {
        success: true,
        message: 'Achievement retrieved successfully',
        data: achievement,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error retrieving achievement: ${error.message}`,
        data: null,
      };
    }
  }

  async update(id: number, updateAchievementDto: UpdateAchievementDto) {
    try {
      const achievement = await this.achievementRepository.findOne({
        where: { id },
      });

      if (!achievement) {
        return {
          success: false,
          message: 'Achievement not found',
          data: null,
        };
      }

      const updatedAchievement = await this.achievementRepository.save({
        ...achievement,
        ...updateAchievementDto,
        administrator: updateAchievementDto.administratorId ? { id: updateAchievementDto.administratorId } : achievement.administrator,
        degree: updateAchievementDto.degreeId ? { id: updateAchievementDto.degreeId } : achievement.degree,
        trainingArea: updateAchievementDto.trainingAreaId ? { id: updateAchievementDto.trainingAreaId } : achievement.trainingArea,
        periodDetail: updateAchievementDto.periodDetailId ? { id: updateAchievementDto.periodDetailId } : achievement.periodDetail,
      });

      return {
        success: true,
        message: 'Achievement updated successfully',
        data: updatedAchievement,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error updating achievement: ${error.message}`,
        data: null,
      };
    }
  }

  async remove(id: number) {
    try {
      const achievement = await this.achievementRepository.findOne({
        where: { id },
        relations: ['details'],
      });

      if (!achievement) {
        return {
          success: false,
          message: 'Achievement not found',
          data: null,
        };
      }

      await this.achievementRepository.remove(achievement);

      return {
        success: true,
        message: 'Achievement deleted successfully',
        data: achievement,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error deleting achievement: ${error.message}`,
        data: null,
      };
    }
  }
}