import {
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ReviewRepository } from './review.repository';
import { CreateReviewDto, UpdateReviewDto } from './dto/review.dto';
import { Service } from '../services/entities/service.entity';
import { ReviewEntity } from './entities/review.entity';
import { UserRepository } from '../users/user.repository';

@Injectable()
export class ReviewService {
  constructor(
    private readonly reviewRepo: ReviewRepository,
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,
    private readonly userRepo: UserRepository,

  ) {}

  async createReview(
    createReviewDto: CreateReviewDto,
  ) {
    try {
      const review: any = await this.reviewRepo.createReview(createReviewDto);

      const [averageScore, reviewCount] = await Promise.all([
        await this.reviewRepo.getAverageReviewScoreForService(review.serviceId),
        await this.reviewRepo.getReviewCount(review.serviceId),
      ]);

      const serviceResponse = await this.serviceRepository.findOne({
        where: { id:review.serviceId },
      })

      if (!serviceResponse) {
        throw new NotFoundException('Service not found');
      }

      const updateServiceDto = {
        totalReviewCount: reviewCount,
        averageReviewScore: averageScore,
      };

      // TODO

      // await this.enrollRepo.update(
      //   {
      //     courseId: review.courseId,
      //     userId: review.userId,
      //   },
      //   {
      //     reviewed: true,
      //   },
      // );

      await this.serviceRepository.update(
        { id: review.serviceId },
        { ...updateServiceDto }
      );


      return review ;
    } catch (error) {
      return { status: HttpStatus.INTERNAL_SERVER_ERROR, error: error };
    }
  }



  async getReviewById(
    id: string,
  ) {
    const review = await this.reviewRepo.getReviewById(id);
    if (!review) {
      return { status: HttpStatus.NOT_FOUND };
    }
    return review ;
  }

  async updateReview(
    updateReviewDto: UpdateReviewDto,
  ){
    const review = await this.reviewRepo.getReviewById(updateReviewDto.id);

    if (!review) {
      return { status: HttpStatus.NOT_FOUND };
    }

    const { id, ...rest } = updateReviewDto;

    const updatedReview = await this.reviewRepo.updateReview(review.id, rest);

    //update course table

    const averageScore = await this.reviewRepo.getAverageReviewScoreForService(
      review.serviceId,
    );

    const updateServiceDto = {
      averageReviewScore: averageScore,
    };

    await this.serviceRepository.update(
      { id: review.serviceId },
      { ...updateServiceDto }
    );

    return updatedReview ;
  }


  async deleteReview(id: string) {
    const review = await this.reviewRepo.getReviewById(id);
    if (!review) {
      return { status: HttpStatus.NOT_FOUND };
    }
    try {
      await this.reviewRepo.deleteReview(id);

      const [averageScore, reviewCount] = await Promise.all([
        this.reviewRepo.getAverageReviewScoreForService(review.serviceId),
        await this.reviewRepo.getReviewCount(review.serviceId),
      ]);

      const serviceResponse = await this.serviceRepository.findOne({
        where: { id:review.serviceId },
      })


      if (!serviceResponse) {
        throw new NotFoundException('Service not found');
      }

      const updateServiceDto = {
        totalReviewCount: reviewCount,
        averageReviewScore: averageScore,
      };

      await this.serviceRepository.update(
        { id: review.serviceId },
        { ...updateServiceDto }
      );

      // TODO

      // await this.enrollRepo.update(
      //   {
      //     courseId: review.courseId,
      //     userId: review.userId,
      //   },
      //   {
      //     reviewed: false,
      //   },
      // );

      return { status: HttpStatus.NO_CONTENT };
    } catch (error) {
      return { status: HttpStatus.INTERNAL_SERVER_ERROR, error: error };
    }
  }



  async getAllReviewsByServiceId({
                                   serviceId,
                                  limit,
                                  offset,
                                  stars,
                                }: {
    serviceId: string;
    limit?: number;
    offset?: number;
    stars?: number;
  }) {
      let reviews, total;

      const { reviewList, count } = await this.reviewRepo.findAllByServiceId({
        serviceId,
        limit,
        offset,
        stars,
      });
      reviews = reviewList;
      total = count;

      if (
        reviews instanceof Array &&
        reviews.length > 0 &&
        reviews[0] instanceof ReviewEntity &&
        total
      ) {
        // Retrieve user data for each review
        const reviewsWithUserData = await Promise.all(
          reviews.map(async (review) => {
            // Ensure userId is defined before querying the user repository
            if (review.userId) {
              const user = await this.userRepo.findOneById(review.userId);
              return {
                ...review,
                userName: user?.name,
                userImageUrl: user?.profileImage,
              };
            }
            return review; // Return the review as is if userId is undefined
          }),
        );
        return {
          data:reviewsWithUserData, meta: { total, limit, offset } ,
        };
      }
      throw new NotFoundException('No reviews found');
  }



  async getReviewByUserAndService(
    userId: string,
    serviceId: string,
  ) {
    const review = await this.reviewRepo.getReviewByUserAndService(
      userId,
      serviceId,
    );
    if (!review) {
      return { status: HttpStatus.NOT_FOUND };
    }

    const user = await this.userRepo.findOneById(review.userId);
    if (!user) {
      return { status: HttpStatus.NOT_FOUND };
    }

    return  {
        ...review,
        userName: user?.name,
        userImageUrl: user?.profileImage,
      }
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
  }) {
      let reviews, total;

      const { reviewList, count } = await this.reviewRepo.getReviewByProvider({
        providerId,
        limit,
        offset,
        stars,
      });
      reviews = reviewList;
      total = count;

      if (
        reviews instanceof Array &&
        reviews.length > 0 &&
        reviews[0] instanceof ReviewEntity &&
        total
      ) {
        const reviewsWithUserData = await Promise.all(
          reviews.map(async (review) => {
            if (review.userId) {
              const user = await this.userRepo.findOneById(review.userId);
              return {
                ...review,
                userName: user?.name,
                userImageUrl: user?.profileImage,
              };
            }
            return review;
          }),
        );
        return {
         data:reviewsWithUserData, meta: { total, limit, offset }
        };
      }
     throw new NotFoundException('No reviews found');
  }


}
