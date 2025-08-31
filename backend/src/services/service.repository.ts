import { Injectable, NotFoundException } from '@nestjs/common';
import {
  Between,
  FindManyOptions,
  FindOperator,
  ILike,
  In,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { Service } from './entities/service.entity';
import { PaginatedRequestDto } from '../users/dto/base.dto';
import {
  CreateServiceDto,
  FindAllByProviderServiceDto,
  FindOneServiceDto,
  FindServiceBySlugDto, SearchServiceDto, UpdateServiceDto,
} from './dto/service.dto';
import { InjectRepository } from '@nestjs/typeorm';



@Injectable()
export class ServiceRepository {
  constructor(
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,
  ) { }
  async createService(createServiceDto: CreateServiceDto): Promise<Service> {
    try {
      const service = this.serviceRepository.create(createServiceDto);
      return await this.serviceRepository.save(service);
    } catch (error) {
      throw error;
    }
  }

  async getServiceById({ id }: FindOneServiceDto): Promise<Service | null> {
    try {
      return await this.serviceRepository.findOne({
        where: { id },
      });
    } catch (error) {
      return null;
    }
  }

  async getServiceBySlug({ slug }: FindServiceBySlugDto): Promise<Service | null> {
    try {
      return await this.serviceRepository.findOne({
        where: { slug },
      });
    } catch (error) {
      return null;
    }
  }

  async getServices({
                     limit,
                     offset,
                   }: PaginatedRequestDto): Promise<Service[] | null> {
    try {
      const options: FindManyOptions<Service> = {
        where: { isArchived: false },
      };

      if ((limit && limit > 0) || (offset && offset > 0)) {
        options.take = limit;
        options.skip = offset;
      }

      return await this.serviceRepository.find(options);
    } catch (error) {
      throw error;
    }
  }

  async countAll(): Promise<number> {
    try {
      return await this.serviceRepository.count({
        where: { isArchived: false },
      });
    } catch (error) {
      return error;
    }
  }

  async countProviders({
                         providerId,
                       }: FindAllByProviderServiceDto): Promise<number> {
    try {
      return await this.serviceRepository.count({
        where: { providerId: providerId },
      });
    } catch (error) {
      return error;
    }
  }

  async updateService(
    updateServiceDto: UpdateServiceDto,
  ): Promise<Service | null | Error> {
    try {
      const service = await this.serviceRepository.findOne({
        where: { id: updateServiceDto.id },
      });
      if (!service) {
        throw new NotFoundException('Service not found');
      }
      this.serviceRepository.merge(service, updateServiceDto);
      return await this.serviceRepository.save(service);
    } catch (error) {
      return error;
    }
  }

  async deleteService(
    findOneServiceDto: FindOneServiceDto,
  ): Promise<Service | Error | null> {
    try {

      // Fetch the service based on the criteria
      const service = await this.serviceRepository.findOne({
        where: findOneServiceDto,
      });

      if (!service) {
        return null; // service not found
      }

      if (service.enrollmentCount > 0) {
        // If there are enrollments, archive the service instead of deleting it
        service.isArchived = true;
        await this.serviceRepository.save(service); // Save the updated service state
        return service;
      }

      // Perform the delete operation if no enrollments
      await this.serviceRepository.delete(findOneServiceDto);
      return service;
    } catch (error) {
      return error;
    }
  }

  async findServicesByProvider({
                                providerId,
                                limit,
                                offset,
                                isPublished,
                                isArchived,
                              }: FindAllByProviderServiceDto): Promise<Service[] | null | Error> {
    try {
      const options: FindOptionsProvider = { where: { providerId, isPublished, isArchived } };
      if ((limit && limit > 0) || (offset && offset > 0)) {
        options.take = limit;
        options.skip = offset;
      }
      // const [services, count] =
      return await this.serviceRepository.find(options);
      // return [services, count];
    } catch (error) {
      return error;
    }
  }

  async search({
                 limit,
                 lowerCmeRange,
                 offset,
                 search,
                 professionId,
                 specialtyIds,
                 typeIds,
                 upperCmeRange,
                 isPublished,
                 isArchived,
                 providerIds,
               }: SearchServiceDto): Promise<{ services: Service[]; count: number }> {
    try {
      const options: FindOptionsFilter = { where: { isPublished, isArchived } };
      if (professionId) {
        options.where.professionId = professionId;
      }
      if (specialtyIds) {
        options.where.specialtyId = In(specialtyIds);
      }
      if (typeIds) {
        options.where.typeId = Array.isArray(typeIds)
          ? In(typeIds)
          : In([typeIds]);
      }
      if (providerIds) {
        options.where.educatorId = Array.isArray(providerIds)
          ? In(providerIds)
          : In([providerIds]);
      }
      if (lowerCmeRange) {
        options.where.cmePoints = MoreThanOrEqual(lowerCmeRange);
      }
      if (upperCmeRange) {
        options.where.cmePoints = LessThanOrEqual(upperCmeRange);
      }
      if (lowerCmeRange && upperCmeRange) {
        options.where.cmePoints = Between(lowerCmeRange, upperCmeRange);
      }
      if (search) {
        options.where.title = ILike(`%${search.trim()}%`);
      }
      if ((limit && limit > 0) || (offset && offset > 0)) {
        options.take = limit;
        options.skip = offset;
      }

      // Add order by createdAt in order
      options.order = {
        createdAt: 'DESC',
      };

      const [services, count] =
        await this.serviceRepository.findAndCount(options);
      return { services, count };
    } catch (error) {
      throw error;
    }
  }
}

interface FindOptionsProvider extends FindOptions {
  where: { providerId: string, isPublished: boolean, isArchived: boolean };
}
interface FindOptions {
  take?: number;
  skip?: number;
}
interface FindOptionsFilter extends FindOptions {
  where: {
    title?: any;
    cmePoints?: any;
    professionId?: string;
    specialtyId?: FindOperator<any>;
    typeId?: FindOperator<any>;
    isPublished: boolean;
    isArchived: boolean;
    educatorId?: FindOperator<any>;
  };
  order?: {
    createdAt?: 'ASC' | 'DESC';
  };
}
