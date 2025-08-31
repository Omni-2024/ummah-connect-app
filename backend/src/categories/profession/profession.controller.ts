import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProfessionService } from './profession.service';

import { Public } from '../../auth/decorator/public.decorator';
import { Roles } from '../../auth/decorator/role.decorator';
import { UserRole } from '../../users/entities/abstract.user.entity';
import { CreateProfessionDto, UpdateProfessionDto } from './dto/profession.dto';

@Controller('profession')
export class ProfessionController {
  constructor(private readonly professionService: ProfessionService) {}

  @Roles([UserRole.ADMIN, UserRole.ROOT])
  @Post()
  async create(@Body() createProfessionDto: CreateProfessionDto) {
    return await this.professionService.create(createProfessionDto);
  }

  @Public()
  @Get()
  async findAll() {
    return await this.professionService.findAll();
  }


  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.professionService.findOne({id});
  }


  @Roles([UserRole.ADMIN, UserRole.ROOT])
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProfessionDto: UpdateProfessionDto,
  ) {
    return await this.professionService.update({...updateProfessionDto,id });
  }


  @Roles([UserRole.ADMIN, UserRole.ROOT])
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.professionService.remove({id});
  }
}
