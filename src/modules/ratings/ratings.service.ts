import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rating } from './entities/rating.entity';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { Institution } from '../institutions/entities/institution.entity';

@Injectable()
export class RatingsService {
  constructor(
    @InjectRepository(Rating)
    private readonly ratingRepository: Repository<Rating>,
    @InjectRepository(Institution)
    private readonly institutionRepository: Repository<Institution>,
  ) {}

  async create(createRatingDto: CreateRatingDto) {
    try {
      const institution = await this.institutionRepository.findOne({
        where: { id: createRatingDto.institutionId },
      });

      if (!institution) {
        return {
          success: false,
          message: 'Institution not found',
          data: null,
        };
      }

      const rating = this.ratingRepository.create({
        ...createRatingDto,
        institution,
      });

      const savedRating = await this.ratingRepository.save(rating);

      return {
        success: true,
        message: 'Rating created successfully',
        data: savedRating,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error creating rating: ${error.message}`,
        data: null,
      };
    }
  }

  async findAll() {
    try {
      const ratings = await this.ratingRepository.find({
        relations: ['institution'],
      });

      return {
        success: true,
        message: 'Ratings retrieved successfully',
        data: ratings,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error retrieving ratings: ${error.message}`,
        data: null,
      };
    }
  }

  async findOne(id: number) {
    try {
      const rating = await this.ratingRepository.findOne({
        where: { id },
        relations: ['institution'],
      });

      if (!rating) {
        return {
          success: false,
          message: `Rating with ID ${id} not found`,
          data: null,
        };
      }

      return {
        success: true,
        message: 'Rating retrieved successfully',
        data: rating,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error retrieving rating: ${error.message}`,
        data: null,
      };
    }
  }

  async findOneName(id: string, institutionId?: number) {
    try {
      const whereClause: any = { letterValue: id };
      
      if (institutionId) {
        whereClause.institution = { id: institutionId };
      }

      const rating = await this.ratingRepository.findOne({
        where: whereClause,
      });

      if (!rating) {
        return {
          success: false,
          message: `Rating with letterValue ${id} not found`,
          data: null,
        };
      }

      return {
        success: true,
        message: 'Rating retrieved successfully',
        data: rating,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error retrieving rating: ${error.message}`,
        data: null,
      };
    }
  }



  async update(id: number, updateRatingDto: UpdateRatingDto) {
    try {
      const rating = await this.ratingRepository.findOne({
        where: { id },
      });

      if (!rating) {
        return {
          success: false,
          message: `Rating with ID ${id} not found`,
          data: null,
        };
      }

      if (updateRatingDto.institutionId) {
        const institution = await this.institutionRepository.findOne({
          where: { id: updateRatingDto.institutionId },
        });

        if (!institution) {
          return {
            success: false,
            message: 'Institution not found',
            data: null,
          };
        }
      }

      const updated = await this.ratingRepository.save({
        ...rating,
        ...updateRatingDto,
      });

      return {
        success: true,
        message: 'Rating updated successfully',
        data: updated,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error updating rating: ${error.message}`,
        data: null,
      };
    }
  }

  async remove(id: number) {
    try {
      const rating = await this.ratingRepository.findOne({
        where: { id },
      });

      if (!rating) {
        return {
          success: false,
          message: `Rating with ID ${id} not found`,
          data: null,
        };
      }

      await this.ratingRepository.remove(rating);

      return {
        success: true,
        message: 'Rating deleted successfully',
        data: rating,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error deleting rating: ${error.message}`,
        data: null,
      };
    }
  }
}