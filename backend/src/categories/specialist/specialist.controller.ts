import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete, Query,
} from '@nestjs/common';
import { SpecialistService } from './specialist.service';

import { Public } from '../../auth/decorator/public.decorator';
import { Roles } from '../../auth/decorator/role.decorator';
import { UserRole } from '../../users/entities/abstract.user.entity';
import { CreateSpecialistDto, FindAllSpecialistsByProfessionDto, UpdateSpecialistDto } from './dto/specialist.dto';

@Controller('specialist')
export class SpecialistController {
  constructor(private readonly specialistService: SpecialistService) {}


  @Roles([UserRole.ADMIN, UserRole.ROOT])
  @Post()
  async create(@Body() createSpecialistDto: CreateSpecialistDto) {
    return await this.specialistService.create(createSpecialistDto);
  }

  @Public()
  @Get()
  async findAllByProfession(
    @Query() findAllSpecialistsByProfessionDto: FindAllSpecialistsByProfessionDto,
  ) {
    return await this.specialistService.findAllByProfessionId(
      findAllSpecialistsByProfessionDto,
    );
  }


  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.specialistService.findOne({id});
  }

  @Roles([UserRole.ADMIN, UserRole.ROOT])
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSpecialistDto: UpdateSpecialistDto,
  ) {
    return await this.specialistService.update({...updateSpecialistDto,id });
  }


  @Roles([UserRole.ADMIN, UserRole.ROOT])
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.specialistService.remove({id});
  }
}
