import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';




import { Public } from '../auth/decorator/public.decorator';
import { Roles } from '../auth/decorator/role.decorator';
import { UserRole } from '../users/entities/abstract.user.entity';
import { CreateReviewDto, GetReviewResponseDto } from './dto/review.dto';
import { ReviewService } from './review.service';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) { }

  @Post()
  @Roles([UserRole.USER, UserRole.BUSINESS_USER, UserRole.BUSINESS_ADMIN])
  async create(
    @Body()
    createReviewDto: CreateReviewDto,
  ){
    return await this.reviewService.createReview(createReviewDto);
  }

  @Public()
  @Get('service')
  async getAllReviewsByServiceId(
    @Query('serviceId') serviceId: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
    @Query('stars') stars?: number,
  ) {
    return await this.reviewService.getAllReviewsByServiceId({
      limit,
      offset,
      serviceId,
      stars,
    });
  }


  @Public()
  @Get(':id')
  async getReviewById(@Param('id') id: string): Promise<GetReviewResponseDto> {
    return await this.reviewService.getReviewById(id);
  }

  @Delete(':id')
  @Roles([
    UserRole.USER,
    UserRole.BUSINESS_USER,
    UserRole.BUSINESS_ADMIN,
    UserRole.ADMIN,
    UserRole.OPERATIONAL_ADMIN,
    UserRole.ROOT,
  ])
  async delete(@Param('id') id: string) {
    return await this.reviewService.deleteReview(id);
  }


  @Public()
  @Get('user/:userId/service/:serviceId')
  async getReviewByUserAndService(
    @Param('userId') userId: string,
    @Param('serviceId') serviceId: string,
  ): Promise<GetReviewResponseDto> {
    return await this.reviewService.getReviewByUserAndService(userId, serviceId);
  }

}
