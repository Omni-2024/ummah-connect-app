import { Injectable, NotFoundException } from '@nestjs/common';
import {
  Between, Brackets,
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
                         isPublished,
                         isArchived,
                         requiredGender,
                       }: FindAllByProviderServiceDto): Promise<number> {
    try {
      const qb = this.serviceRepository
        .createQueryBuilder('s')
        .select('COUNT(1)', 'cnt')
        .where('s.providerId = :providerId', { providerId });

      qb.andWhere('s.isPublished = :isPublished', { isPublished });
      qb.andWhere('s.isArchived = :isArchived', { isArchived });

      if (requiredGender) {
        qb.innerJoin('user', 'p', 'p.id = s.providerId AND p.gender = :gender', {
          gender: requiredGender,
        });
      }

      const row = await qb.getRawOne<{ cnt: string }>();
      return Number(row?.cnt ?? 0);
    } catch (error) {
      throw error;
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
                                 requiredGender,
                               }: FindAllByProviderServiceDto) {
    try {
      const qb = this.serviceRepository
        .createQueryBuilder('s')
        .where('s.providerId = :providerId', { providerId });

      // Optional filters (use DB-portable OR clauses)
      qb.andWhere('s.isPublished = :isPublished', { isPublished });
      qb.andWhere('s.isArchived = :isArchived', { isArchived });

      // Manual join to provider table to filter by gender (no relation required)
      if (requiredGender) {
        qb.innerJoin(
          'user',
          'p',
          `p._id::text = s.provider_id AND p.gender = :gender AND p.deleted_at IS NULL`,
          { gender: requiredGender },
        );
      }

      if (typeof offset === 'number' && offset > 0) qb.skip(offset);
      if (typeof limit === 'number' && limit > 0) qb.take(limit);

      qb.orderBy('s.createdAt', 'DESC');

      const { entities } = await qb.getRawAndEntities();
      return entities;
    } catch (error) {
      throw error; // don't return Error objects, let callers catch
    }
  }

  async search({
                 limit,
                 offset,
                 search,
                 professionId,
                 specialtyIds,
                 typeIds,
                 lowerCmeRange,
                 upperCmeRange,
                 isPublished,
                 isArchived,
                 providerIds,
                 requiredGender
               }: SearchServiceDto): Promise<{ services: Service[]; count: number }> {
    try {
      const qb = this.serviceRepository
        .createQueryBuilder('s')
        .where('1=1'); // base

      // --- simple column filters ---
      qb.andWhere('s.isPublished = :isPublished', { isPublished });
      qb.andWhere('s.isArchived = :isArchived', { isArchived });
      if (professionId) {
        qb.andWhere('s.professionId = :professionId', { professionId });
      }
      if (specialtyIds?.length) {
        qb.andWhere('s.specialtyId IN (:...specialtyIds)', { specialtyIds });
      }
      if (typeIds?.length) {
        qb.andWhere('s.typeId IN (:...typeIds)', { typeIds });
      }
      if (providerIds?.length) {
        // Use `providerId` (rename to your actual column; you had `educatorId` earlier)
        qb.andWhere('s.providerId IN (:...providerIds)', { providerIds });
      }

      // --- range filters (CME points or similar) ---
      if (lowerCmeRange != null && upperCmeRange != null) {
        qb.andWhere('s.cmePoints BETWEEN :l AND :u', {
          l: lowerCmeRange,
          u: upperCmeRange,
        });
      } else if (lowerCmeRange != null) {
        qb.andWhere('s.cmePoints >= :l', { l: lowerCmeRange });
      } else if (upperCmeRange != null) {
        qb.andWhere('s.cmePoints <= :u', { u: upperCmeRange });
      }

      // --- keyword search (ILIKE) ---
      if (search?.trim()) {
        const q = `%${search.trim()}%`;
        qb.andWhere(
          new Brackets((w) => {
            w.where('s.title ILIKE :q', { q })
              .orWhere('s.tagline ILIKE :q', { q })
              .orWhere('s.description ILIKE :q', { q });
          }),
        );
      }

      // --- OPTIONAL GENDER FILTER (join user only when required) ---
      if (requiredGender) {
        // If provider_id is VARCHAR and user._id is UUID → cast to text
        qb.innerJoin(
          'user',
          'p',
          `p._id::text = s.providerId::text AND p.gender = :gender AND p.deleted_at IS NULL`,
          { gender: requiredGender },
        );
        // If you've migrated service.provider_id to UUID, use:
        // qb.innerJoin('user', 'p', `p._id = s.providerId AND p.gender = :gender AND p.deleted_at IS NULL`, { gender: requiredGender });
      }

      // --- soft delete protection (if you use DeleteDateColumn) ---
      qb.andWhere('s.deleted_at IS NULL');

      // --- order + paging ---
      qb.orderBy('s.createdAt', 'DESC');
      if (typeof offset === 'number' && offset > 0) qb.skip(offset);
      if (typeof limit === 'number' && limit > 0) qb.take(limit);

      const [services, count] = await qb.getManyAndCount();
      return { services, count };
    } catch (err) {
      throw err;
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
