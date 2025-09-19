import { Module } from '@nestjs/common';
import { QuestionController } from './faqs.controller';
import { QuestionsService } from './faqs.service';
import { QuestionsRepository } from './faqs.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './faq.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Question])],
  controllers: [QuestionController],
  providers: [QuestionsService,QuestionsRepository],
})
export class QuestionModule {}
