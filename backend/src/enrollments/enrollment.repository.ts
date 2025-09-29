import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EnrollmentEntity } from './enrollment.entity';
import { Repository } from 'typeorm';
import { EnrollUserDto } from './dto/enrollment.dto';
import { ServiceDetailService } from '../services/service.detail.service';
import { ServiceDetailDto } from '../services/dto/service.dto';
import { ServiceRepository } from '../services/service.repository';

function isServiceDetailDto(x: any): x is ServiceDetailDto {
  return x && typeof x === 'object' && 'id' in x && 'title' in x;
}
@Injectable()
export class EnrollmentRepository {
  constructor(
    @InjectRepository(EnrollmentEntity)
    private enrollRepo: Repository<EnrollmentEntity>,
    private serviceRepo: ServiceRepository,
    private serviceDetailsRepo: ServiceDetailService,
  ) { }

  async getEnrollment({
    serviceId,
    userId,
  }: EnrollUserDto): Promise<EnrollmentEntity | null> {
    const enroll = await this.enrollRepo.findOneBy({
      userId,
      serviceId,
    });
    if (!enroll) {
      return null;
    }
    return enroll;
  }


  async newEnrollment(enrollUserDto: EnrollUserDto): Promise<void> {
    const enroll = this.enrollRepo.create(enrollUserDto);

    const service= await this.serviceDetailsRepo.findOneDetail({id:enroll.serviceId})

    if (!isServiceDetailDto(service)) {
      throw new BadRequestException(service?.error ?? 'Service not found');
    }

    if (service) {
      const serviceDetailDto: ServiceDetailDto = Array.isArray(service)
        ? service[0]
        : service;

      await this.enrollRepo.save(enroll);


      if (serviceDetailDto.enrollmentCount) {
        const updateServiceDto = {
          enrollmentCount: Number(serviceDetailDto.enrollmentCount) + 1,
        };

        await this.serviceRepo.updateService({...updateServiceDto,id:serviceDetailDto.id})
      }
      return;
    }
  }

  async updateEnrollment(enroll: EnrollmentEntity): Promise<void> {
    const enrollment = await this.enrollRepo.findOneBy({ id: enroll.id });
    if (!enrollment) {
      throw new BadRequestException('enrollment not found');
    }
    const mergedEnrollment = this.enrollRepo.merge(enrollment, enroll);
    await this.enrollRepo.save(mergedEnrollment);
    return;
  }



  async getEnrollmentByStatus({
    userId,
    completed,
  }: {
    userId: string;
    completed?: boolean;
  }): Promise<EnrollmentEntity[] | null> {
    const enroll = await this.enrollRepo.find({
      where: { userId, completed },
    });
    if (!enroll) {
      return null;
    }
    return enroll;
  }





  async getStudentCountForService({
    serviceId,
  }: {
    serviceId: string;
  }): Promise<number> {
    const count = await this.enrollRepo.countBy({ serviceId });
    return count;
  }

  async getCompletedEnrollmentForService({
    serviceId,
    userId,
  }: EnrollUserDto): Promise<EnrollmentEntity | null> {
    const enroll = await this.enrollRepo.findOneBy({
      userId,
      serviceId,
      completed: true,
    });
    if (!enroll) {
      return null;
    }
    return enroll;
  }

  async getEnrollmentCounts(): Promise<
    { serviceId: string; enrollmentCount: number }[]
  > {
    // Assuming you're using a different repository or connection for the enrollment DB
    const enrollmentRepo = this.enrollRepo; // Use repository or connection for the enrollment DB

    const enrollmentCounts = await enrollmentRepo
      .createQueryBuilder('enrollment')
      .select('enrollment.serviceId', 'serviceId')
      .addSelect('COUNT(enrollment.id)', 'enrollmentCount')
      .groupBy('enrollment.serviceId')
      .getRawMany();

    return enrollmentCounts; // [{ courseId: 'course-id-1', enrollmentCount: 10 }, ...]
  }
}

interface FindOptions {
  take?: number;
  skip?: number;
}
