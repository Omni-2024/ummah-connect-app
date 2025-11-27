import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { ReviewEntity } from './entities/review.entity';
import { CreateReviewDto, CreateReviewRepoDto } from './dto/review.dto';

@Injectable()
export class ReviewRepository {
  constructor(
    @InjectRepository(ReviewEntity)
    private readonly reviewRepository: Repository<ReviewEntity>,
  ) {}

  async getReviewById(id: string): Promise<any> {
    const review = await this.reviewRepository.findOne({ where: { id } });
    return review;
  }

  async createReview(reviewData: CreateReviewRepoDto): Promise<ReviewEntity> {
    const review = this.reviewRepository.create(reviewData);
    return  await this.reviewRepository.save(review);
  }

  async updateReview(
    id: string,
    updateReviewDto: Partial<ReviewEntity>,
  ): Promise<ReviewEntity> {
    await this.reviewRepository.update({ id }, updateReviewDto);
    return await this.getReviewById(id);
  }

  async deleteReview(id: string): Promise<void> {
    await this.reviewRepository.delete({ id });
  }


  async findAllByServiceId({
                             serviceId,
                            limit,
                            offset,
                            stars,
                          }: {
    serviceId: string;
    limit?: number;
    offset?: number;
    stars?: number;
  }): Promise<{ reviewList: ReviewEntity[]; count: number }> {
    try {
      const options: FindOptions = {};
      if (limit && limit > 0) {
        options.take = limit;
      }
      if (offset && offset > 0) {
        options.skip = offset;
      }

      const whereCondition: any = { serviceId };
      if (stars && stars > 0) {
        whereCondition.stars = stars;
      }

      const [reviewList, count] = await this.reviewRepository.findAndCount({
        ...options,
        where: whereCondition,
      });

      return { reviewList, count };
    } catch (error) {
      throw error;
    }
  }


  async getAverageReviewScoreForService(serviceId: string): Promise<number> {
    try {
      const result = await this.reviewRepository
        .createQueryBuilder('review')
        .select('AVG(review.stars)', 'average')
        .where('review.serviceId = :serviceId', { serviceId })
        .getRawOne();

      return result?.average
        ? parseFloat(parseFloat(result.average).toFixed(1))
        : 0;
    } catch (error) {
      throw new BadRequestException('Failed to calculate average review score');
    }
  }

  async getAverageReviewScoreForProvider(providerId: string): Promise<number> {
    try {
      const result = await this.reviewRepository
        .createQueryBuilder('review')
        .select('AVG(review.stars)', 'average')
        .where('review.providerId = :providerId', { providerId })
        .getRawOne();

      return result?.average
        ? parseFloat(parseFloat(result.average).toFixed(1))
        : 0;
    } catch (error) {
      throw new BadRequestException('Failed to calculate average review score');
    }
  }


  async getReviewCount(serviceId: string) {
    return this.reviewRepository.count({
      where: {
        serviceId,
      },
    });
  }

  async getReviewCountProvider(providerId: string) {
    return this.reviewRepository.count({
      where: {
        providerId,
      },
    });
  }



  async getReviewByUserAndService(
    userId: string,
    serviceId: string,
  ): Promise<any> {
    const review = await this.reviewRepository.findOne({
      where: { userId, serviceId },
    });
    return review;
  }

  async getReviewByProvider({
                             providerId,
                             limit,
                             offset,
                             stars,
                           }: {
    providerId: string;
    limit?: number;
    offset?: number;
    stars?: number;
  }): Promise<{ reviewList: ReviewEntity[]; count: number }> {
    try {
      const options: FindOptions = {};
      if (limit && limit > 0) {
        options.take = limit;
      }
      if (offset && offset > 0) {
        options.skip = offset;
      }

      const whereCondition: any = { providerId };
      if (stars && stars > 0) {
        whereCondition.stars = stars;
      }

      const [reviewList, count] = await this.reviewRepository.findAndCount({
        ...options,
        where: whereCondition,
      });

      return { reviewList, count };
    } catch (error) {
      throw error;
    }
  }


}



interface FindOptions {
  take?: number;
  skip?: number;
}
