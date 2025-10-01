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
                         doGender,
                         hasUser,
                         userGender,
                       }: FindAllByProviderServiceDto): Promise<number> {
    const qb = this.serviceRepository
      .createQueryBuilder('s')
      .select('COUNT(1)', 'cnt')
      .where('s.providerId = :providerId', { providerId });

    qb.andWhere('s.isPublished = :isPublished', { isPublished });
    qb.andWhere('s.isArchived = :isArchived', { isArchived });

    qb.leftJoin(
      'user',
      'p',
      `p._id::text = s.provider_id::text AND p.deleted_at IS NULL`
    );

    if (hasUser && userGender) {
      if (doGender==="true") {
        qb.andWhere('p.gender = :userGender', { userGender });
      } else {
        qb.andWhere(
          '(COALESCE(p.same_gender_allow, false) = false OR p.gender = :userGender)',
          { userGender },
        );
      }
    }

    qb.andWhere('s.deleted_at IS NULL');

    const row = await qb.getRawOne<{ cnt: string }>();
    return Number(row?.cnt ?? 0);
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
                                 doGender,
                                 hasUser,
                                 userGender,
                               }: FindAllByProviderServiceDto): Promise<Service[]> {
    const qb = this.serviceRepository
      .createQueryBuilder('s')
      .where('s.providerId = :providerId', { providerId });

    qb.andWhere('s.isPublished = :isPublished', { isPublished });
    qb.andWhere('s.isArchived = :isArchived', { isArchived });

    // Join provider (user) to get gender / flags / best-seller
    qb.leftJoin(
      'user',
      'p',
      `p._id::text = s.provider_id::text AND p.deleted_at IS NULL`
    );

    // ----- Gender rules -----
    if (hasUser && userGender) {
      if (doGender==="true") {
        // A) doGender true: strictly same gender only
        qb.andWhere('p.gender = :userGender', { userGender });
      } else {
        // B) doGender false: if provider enforces same-gender, restrict; otherwise open to all
        // COALESCE handles NULL as false (open)
        qb.andWhere(
          '(COALESCE(p.same_gender_allow, false) = false OR p.gender = :userGender)',
          { userGender },
        );
      }
    }
    // C) No userId -> no gender predicate

    // Soft delete protection
    qb.andWhere('s.deleted_at IS NULL');

    // ----- Ordering -----
    // Best sellers (not expired) first, then title ASC, then createdAt DESC
    qb.addSelect(
      `CASE WHEN p.best_seller_expires IS NOT NULL AND p.best_seller_expires > NOW() THEN 1 ELSE 0 END`,
      'best_seller_first'
    );
    qb.orderBy('best_seller_first', 'DESC')
      .addOrderBy('s.title', 'ASC')
      .addOrderBy('s.createdAt', 'DESC');

    if (typeof offset === 'number' && offset > 0) qb.skip(offset);
    if (typeof limit === 'number' && limit > 0) qb.take(limit);

    return qb.getMany();
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
                 doGender,
                 hasUser,
                 userGender,
               }: SearchServiceDto): Promise<{ services: Service[]; count: number }> {
    const qb = this.serviceRepository
      .createQueryBuilder('s')
      .where('1=1');

    // simple filters (only apply when provided)
    qb.andWhere('s.isPublished = :isPublished', { isPublished });
    qb.andWhere('s.isArchived = :isArchived', { isArchived });

    if (professionId) qb.andWhere('s.professionId = :professionId', { professionId });
    if (specialtyIds?.length) qb.andWhere('s.specialtyId IN (:...specialtyIds)', { specialtyIds });
    if (typeIds?.length) qb.andWhere('s.typeId IN (:...typeIds)', { typeIds });
    if (providerIds?.length) qb.andWhere('s.providerId IN (:...providerIds)', { providerIds });

    // numeric ranges
    if (lowerCmeRange != null && upperCmeRange != null) {
      qb.andWhere('s.cmePoints BETWEEN :l AND :u', { l: lowerCmeRange, u: upperCmeRange });
    } else if (lowerCmeRange != null) {
      qb.andWhere('s.cmePoints >= :l', { l: lowerCmeRange });
    } else if (upperCmeRange != null) {
      qb.andWhere('s.cmePoints <= :u', { u: upperCmeRange });
    }

    // keyword
    if (search?.trim()) {
      const q = `%${search.trim()}%`;
      qb.andWhere(new Brackets(w => {
        w.where('s.title ILIKE :q', { q })
          .orWhere('s.tagline ILIKE :q', { q })
          .orWhere('s.description ILIKE :q', { q });
      }));
    }

    // join provider (user) to access gender / same_gender_allow / best_seller_expires
    qb.leftJoin(
      'user',
      'p',
      `p._id::text = s.provider_id::text AND p.deleted_at IS NULL`
    );
    // If migrated to UUID, use:  `p._id = s.provider_id AND p.deleted_at IS NULL`

    // 3-condition gender logic
    if (hasUser && userGender) {
      if (doGender==="true") {
        // A) doGender true → strictly same gender only
        qb.andWhere('p.gender = :userGender', { userGender });
      } else {
        // B) doGender false → if provider enforces same gender, restrict; else open
        qb.andWhere(
          '(COALESCE(p.same_gender_allow, false) = false OR p.gender = :userGender)',
          { userGender },
        );
      }
    }
    // C) no user → no gender predicate

    // soft delete
    qb.andWhere('s.deleted_at IS NULL');

    // ordering: best sellers first, then title ASC, then createdAt DESC
    qb.addSelect(
      `CASE WHEN p.best_seller_expires IS NOT NULL AND p.best_seller_expires > NOW() THEN 1 ELSE 0 END`,
      'best_seller_first'
    );
    qb.orderBy('best_seller_first', 'DESC')
      .addOrderBy('s.title', 'ASC')
      .addOrderBy('s.createdAt', 'DESC');

    if (typeof offset === 'number' && offset > 0) qb.skip(offset);
    if (typeof limit === 'number' && limit > 0) qb.take(limit);

    const [services, count] = await qb.getManyAndCount();
    return { services, count };
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
