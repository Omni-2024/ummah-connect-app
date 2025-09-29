import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EnrollmentRepository } from './enrollment.repository';
import { ConfigService } from '@nestjs/config';
import { PaymentService } from '../payment/payment.service';
import { UserRepository } from '../users/user.repository';
import { EnrollmentStatusDto, EnrollUserDto } from './dto/enrollment.dto';
import { ServiceRepository } from '../services/service.repository';
import { AbstractServiceEntity } from '../services/entities/abstract.service.entity';
import { ServiceService } from '../services/services.service';

@Injectable()
export class EnrollmentService {
  private readonly baseUrl;
  constructor(
    private readonly paymentService: PaymentService,
    private readonly enrollmentRepo: EnrollmentRepository,
    private readonly userRepo: UserRepository,
    private readonly serviceRepo:ServiceRepository,
    private readonly serviceService:ServiceService,
    // private readonly notificationService: NotificationService,

    private readonly configService: ConfigService,
  ) {
    this.baseUrl = this.configService.getOrThrow<string>('APP_BASE_URL');
  }

  async enroll(
    enrollUserDto: EnrollUserDto,
  ) {
      const { serviceId, userId } = enrollUserDto;

      // Check if user is already enrolled
      const existingEnrollment =
        await this.enrollmentRepo.getEnrollment(enrollUserDto);
      if (existingEnrollment) {
        throw new BadRequestException('User already enrolled');
      }

      const serviceResponse=await this.serviceRepo.getServiceById({id:serviceId})

      if (!serviceResponse) {
        throw new BadRequestException('Service not found');
      }

      const service = serviceResponse as AbstractServiceEntity;

      if (service.price !== 0) {
        console.log('Service is paid');

        // Get payment details
        const payment: any =
          await this.paymentService.getAllPaymentsByServiceIdAndUserId(
            serviceId,
            userId,
          );

        if (payment.status === HttpStatus.NOT_FOUND) {
          throw new NotFoundException('Payment not found');
        }

        if (
          payment.status !== HttpStatus.OK ||
          payment.data?.status !== 'succeeded'
        ) {
          throw new BadRequestException('Payment not completed');
        }
      } else {
        console.log('Service is free');
      }

      // Enroll the user and update related records
      await this.enrollUser(enrollUserDto);

      return { status: HttpStatus.OK };
  }

  private async enrollUser(enrollUserDto: EnrollUserDto): Promise<void> {
    await this.enrollmentRepo.newEnrollment(enrollUserDto);
    await this.userRepo.updateTotalServices({ id: enrollUserDto.userId });
    await this.serviceService.updateEnrollment(enrollUserDto.serviceId)
  }


  async enrollGetStatus(
    enrollUserDto: EnrollUserDto,
  ) {
      const enroll = await this.enrollmentRepo.getEnrollment(enrollUserDto);
      if ( !enroll) {
        throw new BadRequestException('user not enrolled');
      }
      const enrollStatus: EnrollmentStatusDto = {
        progression: enroll.progression,
        completed: enroll.completed,
        serviceId: enroll.serviceId,
        userId: enroll.userId,
        enrollmentId: enroll.id,
        enrollmentDate: enroll.enrollmentDate,
        completedAt: enroll.completedAt,
      };
      return enrollStatus ;
  }

  async getAllForUser(
    userId: string,
  ) {
      const enroll = await this.enrollmentRepo.getEnrollmentByStatus({
        userId,
      });
      if (!enroll) {
        throw new NotFoundException('No enrollments found');
      }
      return  enroll ;
  }

  async getCompletedForUser(
    userId: string,
  ){
      const enroll = await this.enrollmentRepo.getEnrollmentByStatus({
        userId,
        completed: true,
      });
      if (!enroll) {
        throw new NotFoundException('No enrollments found');
      }
      return enroll ;
  }

  async getActiveForUser(
    userId: string,
  ) {
      const enroll = await this.enrollmentRepo.getEnrollmentByStatus({
        userId,
        completed: false,
      });
      if (!enroll) {
        throw new NotFoundException('No enrollments found');
      }
      return enroll ;
  }

  async getStudentCountForService(
    serviceId: string,
  ) {
      const count = await this.enrollmentRepo.getStudentCountForService({
        serviceId,
      });
      return {  data: { count: count } };
  }

  async getEnrollmentCounts(): Promise<
    { serviceId: string; enrollmentCount: number }[]
  > {
    const enrollmentCount = this.enrollmentRepo.getEnrollmentCounts();
    return enrollmentCount;
  }
}
