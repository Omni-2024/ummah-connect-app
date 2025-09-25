import { HttpStatus, Injectable } from '@nestjs/common';
import { PaymentRepository } from './payment.repository';
import { PaymentEntity } from './payment.entity';
import { CreatePaymentDto, UpdatePaymentDto } from '../users/dto/user.dto';


@Injectable()
export class PaymentService {
  constructor(private readonly paymentRepo: PaymentRepository) { }

  async createPayment(
    createPaymentDto: CreatePaymentDto,
  ){
    try {
      const payment = await this.paymentRepo.createPayment(createPaymentDto);
      return { status: HttpStatus.CREATED, data: payment };
    } catch (error) {
      return { status: HttpStatus.INTERNAL_SERVER_ERROR, error: error };
    }
  }

  async getPaymentById(
    id: string,
  ){
    const payment = await this.paymentRepo.getPaymentById(id);
    if (!payment) {
      return { status: HttpStatus.NOT_FOUND };
    }
    return { status: HttpStatus.OK, data: payment };
  }

  async updatePayment(
    updatePaymentDto: UpdatePaymentDto,
  ){
    const payment = await this.paymentRepo.getPaymentByPaymentIntend(
      updatePaymentDto.id,
    );

    if (!payment) {
      return { status: HttpStatus.NOT_FOUND };
    }

    // Destructure to remove paymentIntend and id from updatePaymentDto
    const { paymentIntent, id, ...rest } = updatePaymentDto;

    const updatedPayment = await this.paymentRepo.updatePayment(
      payment.id,
      rest,
    );
    return { status: HttpStatus.OK, data: updatedPayment };
  }

  async deletePayment(id: string) {
    const payment = await this.paymentRepo.getPaymentById(id);
    if (!payment) {
      return { status: HttpStatus.NOT_FOUND };
    }
    try {
      await this.paymentRepo.deletePayment(id);
      return { status: HttpStatus.NO_CONTENT };
    } catch (error) {
      return { status: HttpStatus.INTERNAL_SERVER_ERROR, error: error };
    }
  }

  async getAllPayments(){
    const payments = await this.paymentRepo.getAllPayments();
    if (!payments || payments.length === 0) {
      return { status: HttpStatus.NOT_FOUND };
    }

    return { status: HttpStatus.OK, data: payments };
  }

  // Service method to get all payments by userId
  // async getAllPaymentsByUserId(
  //   userId: string,
  // ): Promise<MicroserviceResponseDto<PaymentEntity[]>> {
  //   const payments = await this.paymentRepo.findAllByUserId(userId);
  //   if (!payments || payments.length === 0) {
  //     return { status: HttpStatus.NOT_FOUND };
  //   }

  //   return { status: HttpStatus.OK, data: payments };
  // }

  async getAllPaymentsByUserId({
    limit,
    offset,
    query,
  }: {
    query?: string;
    limit?: number;
    offset?: number;
  }) {
    try {
      let payments, total;

      const { paymentList, count } = await this.paymentRepo.findAllByUserId({
        query,
        limit,
        offset,
      });
      payments = paymentList;
      total = count;

      if (
        payments instanceof Array &&
        payments.length > 0 &&
        payments[0] instanceof PaymentEntity &&
        total
      ) {
        return {
          status: HttpStatus.OK,
          data: { data: payments, meta: { total, limit, offset } },
        };
      }
      return { status: HttpStatus.NOT_FOUND, error: 'No payments found' };
    } catch (e) {
      return { status: HttpStatus.INTERNAL_SERVER_ERROR, error: e.message };
    }
  }

  // Service method to get all payments by courseId
  async getAllPaymentsByServiceId(
    serviceId: string,
  ) {
    const payments = await this.paymentRepo.findAllByServiceId(serviceId);
    if (!payments || payments.length === 0) {
      return { status: HttpStatus.NOT_FOUND };
    }

    return   payments ;
  }

  // Service method to get all payments by courseId
  async getAllPaymentsByServiceIdAndUserId(
    serviceId: string,
    userId: string,
  ) {
    const payments = await this.paymentRepo.findOneByServiceIdAndUserId(
      serviceId,
      userId,
    );
    if (!payments) {
      return { status: HttpStatus.NOT_FOUND };
    }

    return payments ;
  }

  // TODO: remove this method later
  // async upsertPayment(
  //   updatePaymentDto: UpdatePaymentDto,
  // ): Promise<MicroserviceResponseDto<PaymentEntity>> {
  //   const payment = await this.paymentRepo.getPaymentByPaymentIntend(
  //     updatePaymentDto.id,
  //   );

  //   let updatedPayment;

  //   if (!payment) {
  //     const { id, ...rest } = updatePaymentDto;
  //     updatedPayment = await this.paymentRepo.createPayment(rest);

  //     return { status: HttpStatus.CREATED, data: updatedPayment };
  //   } else {
  //     // Destructure to remove paymentIntend and id from updatePaymentDto
  //     const { paymentIntent, id, ...rest } = updatePaymentDto;

  //     updatedPayment = await this.paymentRepo.updatePayment(payment.id, rest);
  //     return { status: HttpStatus.OK, data: updatedPayment };
  //   }
  // }

  async upsertPayment(
    updatePaymentDto: UpdatePaymentDto,
  ) {
    try {
      const updatedPayment = await this.paymentRepo.upsertPayment(updatePaymentDto);
      //
      if (!updatedPayment) {
        return { status: HttpStatus.NOT_FOUND };
      }
      //
      return { status: HttpStatus.OK, data: updatedPayment };
    } catch (error) {
      console.error('Upsert payment failed:', error);
      return { status: HttpStatus.INTERNAL_SERVER_ERROR, error };
    }
  }
}
