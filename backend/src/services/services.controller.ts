import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';

import { Roles } from '../auth/decorator/role.decorator';
import { Public } from '../auth/decorator/public.decorator';
import { UserRole } from 'src/users/entities/abstract.user.entity';
import {  ServiceService } from './services.service';
import { ServiceDetailService } from './service.detail.service';
import { CreateServiceDto, UpdateServiceDto } from './dto/service.dto';

@Controller('service')
export class ServiceController {
  constructor(
    private readonly serviceService: ServiceService,
    private readonly serviceDetailService: ServiceDetailService
) { }

  @Roles([UserRole.ADMIN, UserRole.ROOT])
  @Post()
  async create(@Body() createServiceDto: CreateServiceDto) {
    return await this.serviceService.create(createServiceDto);
  }

  @Public()
  @Get('/all')
  async findAll(
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
    @Query('search') search?: string,
    @Query('provider') providerId?: string,
    @Query('providers') providerIds?: string[],
    @Query('profession') professionId?: string,
    @Query('professions') professionIds?: string[],
    @Query('type') typeId?: string,
    @Query('types') typeIds?: string[],
    @Query('specialty') specialtyId?: string,
    @Query('specialties') specialtyIds?: string[],
    @Query('cmeUp') upperCmeRange?: number,
    @Query('cmeDown') lowerCmeRange?: number,
    @Query('isPublished') isPublished?: boolean,
    @Query('isArchived') isArchived?: boolean,
    @Query('isPopular') isPopular?: boolean,
  ) {
    if (isPublished === undefined) {
      isPublished = true;
    }
    if (isArchived === undefined) {
      isArchived = false;
    }
    if (isPopular === undefined) {
      isPopular = false;
    }

    if (providerId){
      return await this.serviceService.findAllByProviders({
        limit,
        offset,
        providerId,
        isPublished,
        isArchived,
      })
    }
    else {
      return await this.serviceService.search({
        limit,
        offset,
        search,
        professionId,
        typeId,
        specialtyId,
        typeIds,
        professionIds,
        specialtyIds,
        upperCmeRange,
        lowerCmeRange,
        isPublished,
        isArchived,
        providerIds,
        isPopular,
      });
    }
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.serviceService.findOne({id});
  }


  // @Public()
  // @Get('detail/:id')
  // async findOneDetail(@Param('id') id: string) {
  //   return this.serviceDetailService.findOneDetail(id);
  // }
  //
  //
  // @Public()
  // @Get('detail/slug/:slug')
  // async findOneDetailBySlug(@Param('slug') slug: string) {
  //   return this.serviceDetailService.findOneDetailBySlug(slug);
  // }

  @Roles([UserRole.ADMIN, UserRole.ROOT])
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateServiceDto: UpdateServiceDto,
  ) {
    return await this.serviceService.update({ ...updateServiceDto, id });
  }


  @Roles([UserRole.ADMIN, UserRole.ROOT])
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.serviceService.remove({id});
  }


  @Public()
  @Get('/all/services')
  async findAllServices(
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    return await this.serviceService.findAll({
      limit,
      offset,
    });
  }
}
