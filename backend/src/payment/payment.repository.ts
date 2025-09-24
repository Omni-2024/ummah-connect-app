import {
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { PaymentEntity } from './payment.entity';


@Injectable()
export class PaymentRepository {
  constructor(
    @InjectRepository(PaymentEntity)
    private readonly paymentRepository: Repository<PaymentEntity>,
  ) { }

  async getPaymentById(id: string): Promise<any> {
    const payment = await this.paymentRepository.findOne({ where: { id } });
    return payment;
  }

  async getPaymentByPaymentIntend(id: string): Promise<any> {
    const payment = await this.paymentRepository.findOne({
      where: { paymentIntent: id },
    });
    return payment;
  }

  async createPayment(
    paymentData: Partial<PaymentEntity>,
  ): Promise<PaymentEntity> {
    const payment = this.paymentRepository.create(paymentData);
    return await this.paymentRepository.save(payment);
  }

  async updatePayment(
    id: string,
    updatePaymentDto: Partial<PaymentEntity>,
  ): Promise<PaymentEntity> {
    await this.paymentRepository.update({ id }, updatePaymentDto);
    return await this.getPaymentById(id);
  }

  async upsertPayment(paymentData: Partial<PaymentEntity>): Promise<PaymentEntity | null> {
    await this.paymentRepository.upsert(paymentData, ['paymentIntent']);
    //
    return await this.paymentRepository.findOne({
      where: { paymentIntent: paymentData.paymentIntent },
    });
  }

  async deletePayment(id: string): Promise<void> {
    await this.paymentRepository.delete({ id });
  }

  async getAllPayments(): Promise<PaymentEntity[]> {
    return await this.paymentRepository.find();
  }

  // Method to get all payments by userId
  // async findAllByUserId(userId: string): Promise<PaymentEntity[]> {
  //   return this.paymentRepository.find({ where: { userId } });
  // }

  async findAllByUserId({
    query,
    limit,
    offset,
  }: {
    query?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ paymentList: PaymentEntity[]; count: number }> {
    try {
      const options: FindOptions = {};
      if (limit && limit > 0) {
        options.take = limit;
      }
      if (offset && offset > 0) {
        options.skip = offset;
      }
      const [paymentList, count] = await this.paymentRepository.findAndCount({
        ...options,
        where: [{ userId: query }],
      });

      return { paymentList, count };
    } catch (error) {
      throw error;
    }
  }

  async findAllByServiceId(serviceId: string): Promise<PaymentEntity[]> {
    return this.paymentRepository.find({ where: { serviceId } });
  }

  async findOneByServiceIdAndUserId(
    serviceId: string,
    userId: string,
  ): Promise<PaymentEntity | null> {
    return this.paymentRepository.findOne({
      where: {
        serviceId,
        userId,
      },
    });
  }

}



interface FindOptions {
  take?: number;
  skip?: number;
}
