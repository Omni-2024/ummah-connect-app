import { HttpStatus, Injectable } from '@nestjs/common';
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
    findAllAssessmentQuestionByCourseIdDto: FindAllFaqQuestionByServiceIdDto,
  ){
      const questions = await this.questionRepository.findAllByService(
        findAllAssessmentQuestionByCourseIdDto,
      );
      if (!questions) {
        return { status: HttpStatus.BAD_REQUEST, error: 'No question found' };
      }
      if (questions.length === 0) {
        return { status: HttpStatus.NOT_FOUND, error: 'No question found' };
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
        return { status: HttpStatus.NOT_FOUND, error: 'No question found' };
      }
      return  question ;
  }

  async update(
    id: string, dto: UpdateFaqQuestionDto
  ) {
    const { id: _ignore, ...data } = dto;
    const question = await this.questionRepository.update({ id, ...data });
    if (!question) {
      return { status: HttpStatus.BAD_REQUEST, error: 'No question found' };
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
        return { status: HttpStatus.BAD_REQUEST, error: 'No question found' };
      }
      return question ;
  }
}
