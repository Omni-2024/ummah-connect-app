import { Injectable } from '@nestjs/common';
import { IsNull, Repository } from 'typeorm';
import { Question } from './faq.entity';
import {
  CreateFaqQuestionDto,
  FindAllFaqQuestionByServiceIdDto,
  FindOneFaqQuestionDto,
  UpdateFaqQuestionDto,
} from './dto/faq.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class QuestionsRepository {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
  ) {}

  async create(
    createQuestionDto: CreateFaqQuestionDto,
  ): Promise<Question> {
    try {
      const question = await this.questionRepository.create(createQuestionDto);
      return await this.questionRepository.save(question);
    } catch (e) {
      throw e;
    }
  }

  async findAllByService(
    findAllFaqQuestionByServiceIdDto: FindAllFaqQuestionByServiceIdDto,
  ): Promise<Question[] | null> {
    try {
      return await this.questionRepository.find({
        where: {
          serviceId: findAllFaqQuestionByServiceIdDto.serviceId,
          deletedAt: IsNull(),
        },
      })
    } catch (e) {
      throw e;
    }
  }


  async findOne(
    findOneAssessmentQuestionDto: FindOneFaqQuestionDto,
  ): Promise<Question | null> {
    try {
      return await this.questionRepository.findOneBy(
        findOneAssessmentQuestionDto,
      );
    } catch (e) {
      throw e;
    }
  }

  async update(
    updateAssessmentQuestionDto: UpdateFaqQuestionDto,
  ): Promise<Question | null> {
    try {
      const question = await this.questionRepository.findOneBy({
        id: updateAssessmentQuestionDto.id,
      });
      if (!question) {
        return null;
      }
      const updatedQuestion = this.questionRepository.merge(
        question,
        updateAssessmentQuestionDto,
      );

      return await this.questionRepository.save(updatedQuestion);
    } catch (e) {
      throw e;
    }
  }

  async remove(
    findOneAssessmentQuestionDto: FindOneFaqQuestionDto,
  ): Promise<Question | null> {
    try {
      const question = await this.questionRepository.findOneBy(
        findOneAssessmentQuestionDto,
      );
      if (!question) {
        return null;
      }
      return await this.questionRepository.softRemove(question);
    } catch (e) {
      throw e;
    }
  }
}
