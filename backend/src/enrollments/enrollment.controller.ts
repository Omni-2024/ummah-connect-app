import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';
import { Public } from '../auth/decorator/public.decorator';
import { Roles } from '../auth/decorator/role.decorator';
import { UserRole } from 'src/users/entities/abstract.user.entity';
import { EnrollUserDto } from './dto/enrollment.dto';

@Controller('enrollment')
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  @Roles([UserRole.USER, UserRole.BUSINESS_USER])
  @Post()
  async enroll(@Body() enrollDto: EnrollUserDto) {
    return await this.enrollmentService.enroll(enrollDto);
  }

  @Roles([UserRole.USER, UserRole.BUSINESS_USER])
  @Get('/status')
  async enrollGetStatus(
    @Query('userId') userId: string,
    @Query('serviceId') serviceId: string,
  ) {
    return await this.enrollmentService.enrollGetStatus({
      userId,
      serviceId,
    });
  }


  @Roles([UserRole.USER, UserRole.BUSINESS_USER])
  @Get()
  async getAllEnrollments(@Query('id') userId: string) {
    return await this.enrollmentService.getAllForUser(
      userId,
    );
  }

  //   @Get('/active')
  //   async getActiveForUser(@Query('id') userId: string) {
  //     return await this.enrollmentService.getActiveForUser({ userId });
  //   }

  @Public()
  @Get('/student-count')
  async getStudentCountForCourse(@Query('id') serviceId: string) {
    return await this.enrollmentService.getStudentCountForService(serviceId);
  }
}
