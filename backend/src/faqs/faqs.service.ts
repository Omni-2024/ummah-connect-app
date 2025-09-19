import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { QuestionsRepository } from './faqs.repository';
import {
  CreateFaqQuestionDto,
  FindAllFaqQuestionByServiceIdDto,
  FindOneFaqQuestionDto,
  UpdateFaqQuestionDto,
} from './dto/faq.dto';

@Injectable()
export class QuestionsService {
  constructor(private readonly questionRepository: QuestionsRepository) {}
  async create(
    createAssessmentQuestionDto: CreateFaqQuestionDto,
  ){

      const question = await this.questionRepository.create(
        createAssessmentQuestionDto,
      );
      return  question ;
  }

  async findAllByService(
    findAllFaqQuestionByServiceIdDto: FindAllFaqQuestionByServiceIdDto,
  ){
      const questions = await this.questionRepository.findAllByService(
        findAllFaqQuestionByServiceIdDto,
      );
      if (!questions) {
        throw new NotFoundException('No faq found');
      }
      if (questions.length === 0) {
        throw new NotFoundException('No faq found');
      }
      return  questions ;
  }

  async findOne(
    findOneAssessmentQuestionDto: FindOneFaqQuestionDto,
  ) {
      const question = await this.questionRepository.findOne(
        findOneAssessmentQuestionDto,
      );
      if (!question) {
        throw new NotFoundException('No faq found');
      }
      return  question ;
  }

  async update(
    id: string, dto: UpdateFaqQuestionDto
  ) {
    const { id: _ignore, ...data } = dto;
    const question = await this.questionRepository.update({ id, ...data });
    if (!question) {
      throw new NotFoundException('No faq found');
    }
      return  question ;
  }

  async remove(
    findOneAssessmentQuestionDto: FindOneFaqQuestionDto,
  ){
      const question = await this.questionRepository.remove(
        findOneAssessmentQuestionDto,
      );
      if (!question) {
        throw new NotFoundException('No faq found');
      }
      return question ;
  }
}
