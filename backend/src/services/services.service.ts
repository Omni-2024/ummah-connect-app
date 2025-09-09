import { HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import {
  CreateServiceDto,
  FindAllByProviderServiceDto,
  FindOneServiceDto,
  SearchServiceDto,
  UpdateServiceDto,
} from './dto/service.dto';
import { ServiceRepository } from './service.repository';
import { PaginatedRequestDto } from '../users/dto/base.dto';
import { Service } from './entities/service.entity';

@Injectable()
export class ServiceService {
 constructor(
   private readonly serviceRepo: ServiceRepository,

 ) {
 }

  async create(
    createServiceDto: CreateServiceDto,
  ) {
    try {
      createServiceDto.slug = createServiceDto.title
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '');
      //
      const course = await this.serviceRepo.createService(createServiceDto);
      return  course ;
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  async findAll(
    findAllServicesDto: PaginatedRequestDto,
  ) {
    try {
      const services = await this.serviceRepo.getServices(findAllServicesDto);
      if (
        services instanceof Array &&
        services.length > 0 &&
        services[0] instanceof Service
      ) {
        const { limit, offset } = findAllServicesDto;
        const total = await this.serviceRepo.countAll();
        return { data: services, meta: { total, limit, offset  }, };
      }
      throw new NotFoundException('No services found');
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  async search(
    searchServiceDto: SearchServiceDto,
  ) {
    try {
      const { services, count } = await this.serviceRepo.search(searchServiceDto);

      if (
        services instanceof Array &&
        services.length > 0 &&
        services[0] instanceof Service
      ) {
        const { limit, offset } = searchServiceDto;
        const total = count;

        return {
          data: services, meta: { total, limit, offset  },
        };
      }
      throw new NotFoundException('No services found');
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  async findAllByProviders(
    findAllByProviderServiceDto: FindAllByProviderServiceDto,
  ){
    try {
      const services = await this.serviceRepo.findServicesByProvider(
        findAllByProviderServiceDto,
      );
      if (
        services instanceof Array &&
        services.length > 0 &&
        services[0] instanceof Service
      ) {
        const { limit, offset } = findAllByProviderServiceDto;
        const total = await this.serviceRepo.countProviders(
          findAllByProviderServiceDto,
        );
        return {
          data: services, meta: { total, limit, offset }
        };
      }
      throw new NotFoundException('No services found');
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  async findOne(
    findOneServiceDto: FindOneServiceDto,
  ){
    try {
      const service = await this.serviceRepo.getServiceById(findOneServiceDto);
      if (service instanceof Service) {
        return  service ;
      }
      throw new NotFoundException('No services found');
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  async update(
    updateServiceDto: UpdateServiceDto,
  ){
    try {
      const service = await this.serviceRepo.updateService(updateServiceDto);
      if (service instanceof Service) {
        return service;
      }
      throw new NotFoundException('No services found');
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  async remove(
    findOneServiceDto: FindOneServiceDto,
  ){
    try {
      const service = await this.serviceRepo.deleteService(findOneServiceDto);
      if (service instanceof Service) {
        return service ;
      }
      return { status: HttpStatus.BAD_REQUEST, error: 'Service not found' };
    } catch (e) {
      return { status: HttpStatus.INTERNAL_SERVER_ERROR, error: e.message };
    }
  }

  async updateEnrollment(id: string) {
    try {
      const service = await this.serviceRepo.getServiceById({ id });
      if (service instanceof Service) {
        service.enrollmentCount += 1;
        await this.serviceRepo.updateService(service);
        return { status: HttpStatus.OK };
      }
      return { status: HttpStatus.BAD_REQUEST, error: 'Service not found' };
    } catch (e) {
      return { status: HttpStatus.INTERNAL_SERVER_ERROR, error: e.message };
    }
  }

  // async searchServiceOrderedByEnrollment(
  //   filters: SearchServiceDto,
  // ){
  //   try {
  //     // Step 1: Fetch enrollment counts from the separate database
  //     const enrollment = await firstValueFrom(
  //       this.userService.send<
  //         { courseId: string; enrollmentCount: number }[] // Request payload type
  //       >(EnrollMessagePattern.enrollGetCountForEachCourse, {}),
  //     );
  //
  //     // Step 2: Fetch courses from the course database
  //     const { courses, count } = await this.courseRepo.search(filters);
  //
  //     // Step 3: Create a map of courseId to enrollmentCount
  //     const enrollmentMap = new Map(
  //       enrollment.map((item) => [item.courseId, Number(item.enrollmentCount)]),
  //     );
  //
  //     // Step 4: Sort courses by enrollmentCount in descending order
  //     const sortedCourses = courses.sort((a, b) => {
  //       const enrollmentA = enrollmentMap.get(a.id) || 0;
  //       const enrollmentB = enrollmentMap.get(b.id) || 0;
  //       return enrollmentB - enrollmentA; // Sort in descending order
  //     });
  //
  //     const { limit, offset } = filters;
  //     const total = count;
  //
  //     // Step 5: Return the sorted courses and count
  //     return {
  //       status: HttpStatus.OK,
  //       data: { data: sortedCourses, meta: { total, limit, offset } },
  //     };
  //   } catch (error) {
  //     throw error;
  //   }
  // }


}