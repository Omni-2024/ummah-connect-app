import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Roles } from '../auth/decorator/role.decorator';
import { UserRole } from '../users/entities/abstract.user.entity';
import { QuestionsService } from './faqs.service';
import { CreateFaqQuestionDto, UpdateFaqQuestionDto } from './dto/faq.dto';
import { Public } from '../auth/decorator/public.decorator';

@Controller('faq')
export class QuestionController {
  constructor(private readonly questionService: QuestionsService) {}

  @Roles([UserRole.ADMIN, UserRole.ROOT, UserRole.BUSINESS_ADMIN])
  @Post()
  async create(@Body() createQuestionDto: CreateFaqQuestionDto) {
    return await this.questionService.create(createQuestionDto);
  }

  @Public()
  @Get()
  async findAll(@Query('serviceId') serviceId: string) {
    return await this.questionService.findAllByService({ serviceId });
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.questionService.findOne({ id });
  }

  @Roles([UserRole.ADMIN, UserRole.ROOT,UserRole.BUSINESS_ADMIN])
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateQuestionDto: UpdateFaqQuestionDto,
  ) {
    return await this.questionService.update( id, updateQuestionDto );
  }

  @Roles([UserRole.ADMIN, UserRole.ROOT,UserRole.BUSINESS_ADMIN])
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.questionService.remove({id});
  }
}
