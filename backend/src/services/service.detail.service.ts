import { HttpStatus, Injectable } from '@nestjs/common';
import { FindOneServiceDto, FindServiceBySlugDto, ServiceDetailDto } from './dto/service.dto';
import { ServiceRepository } from './service.repository';
import { Service } from './entities/service.entity';
import { ProfessionRepository } from '../categories/profession/profession.repository';
import { SpecialistRepository } from '../categories/specialist/specialist.repository';


@Injectable()
export class ServiceDetailService {
  constructor(
    private readonly serviceRepo: ServiceRepository,
    private readonly professionRepo:ProfessionRepository,
    private readonly specialistRepo:SpecialistRepository

  ) {}

  async findOneDetail(
    findOneServiceDto: FindOneServiceDto,
  ) {
    try {
      const service = await this.serviceRepo.getServiceById(findOneServiceDto);
      if (service instanceof Service) {
        const {
          averageReviewScore,
          cmeId,
          cmePoints,
          coverImageUrl,
          description,
          discount,
          discountEnabled,
          duration,
          providerId,
          id,
          learningPoints,
          price,
          professionId,
          tagline,
          title,
          totalReviewCount,
          totalReviewScore,
          specialtyId,
          enrollmentCount,
          slug,
          isArchived
        } = service;
        const serviceDetail: ServiceDetailDto = {
          id,
          title,
          tagline,
          description,
          coverImageUrl,
          cmePoints,
          provider: {
            id: '',
            name: '',
            designation: '',
            bio: '',
            profileImageUrl: '',
          },
          price,
          cmeId,
          totalReviewScore,
          totalReviewCount,
          averageReviewScore,
          profession: { id: '', name: '' },
          discount,
          discountEnabled,
          duration,
          learningPoints,
          enrollmentCount,
          slug,
          isArchived
        };

        // const educator = await this.educatorRepo.findOne({ id: educatorId });
        // if (educator) {
        //   serviceDetail.educator = { ...educator };
        // }

        const profession = await this.professionRepo.findOne({
          id: professionId,
        });
        if (profession) {
          serviceDetail.profession = { ...profession };
        }
        if (specialtyId) {
          const specialist = await this.specialistRepo.findOne({
            id: specialtyId,
          });
          if (specialist) {
            serviceDetail.specialty = { ...specialist };
          }
        }


        return serviceDetail ;
      }
      return { status: HttpStatus.BAD_REQUEST, error: 'Service not found' };
    } catch (e) {
      return { status: HttpStatus.INTERNAL_SERVER_ERROR, error: e.message };
    }
  }

  async findOneDetailBySlug(
    findCourseBySlugDto: FindServiceBySlugDto,
  ) {
    try {
      const service = await this.serviceRepo.getServiceBySlug(findCourseBySlugDto);
      if (service instanceof Service) {
        const {
          averageReviewScore,
          cmeId,
          cmePoints,
          coverImageUrl,
          description,
          discount,
          discountEnabled,
          duration,
          providerId,
          id,
          learningPoints,
          price,
          professionId,
          tagline,
          title,
          totalReviewCount,
          totalReviewScore,
          specialtyId,
          enrollmentCount,
          slug,
          isArchived
        } = service;
        const serviceDetail: ServiceDetailDto = {
          id,
          title,
          tagline,
          description,
          coverImageUrl,
          cmePoints,
          provider: {
            id: '',
            name: '',
            designation: '',
            bio: '',
            profileImageUrl: '',
          },
          price,
          cmeId,
          totalReviewScore,
          totalReviewCount,
          averageReviewScore,
          profession: { id: '', name: '' },
          discount,
          discountEnabled,
          duration,
          learningPoints,
          enrollmentCount,
          slug,
          isArchived
        };

        // const educator = await this.educatorRepo.findOne({ id: educatorId });
        // if (educator) {
        //   courseDetail.educator = { ...educator };
        // }

        const profession = await this.professionRepo.findOne({
          id: professionId,
        });
        if (profession) {
          serviceDetail.profession = { ...profession };
        }

        if (specialtyId) {
          const specialist = await this.specialistRepo.findOne({
            id: specialtyId,
          });
          if (specialist) {
            serviceDetail.specialty = { ...specialist };
          }
        }



        return  serviceDetail ;
      }
      return { status: HttpStatus.BAD_REQUEST, error: 'Service not found' };
    } catch (e) {
      return { status: HttpStatus.INTERNAL_SERVER_ERROR, error: e.message };
    }
  }


}