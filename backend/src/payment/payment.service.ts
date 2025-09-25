import { HttpStatus, Injectable } from '@nestjs/common';
import { AggregateReturn, PaymentRepository } from './payment.repository';
import { PaymentEntity } from './payment.entity';
import { CreatePaymentDto, UpdatePaymentDto } from '../users/dto/user.dto';
import dayjs from 'dayjs';
import {
  GroupByType,
  PaymentStatsQueryDto,
  ScopeType,
} from './dto/payment-stats.dto';



@Injectable()
export class PaymentService {
  constructor(private readonly paymentRepo: PaymentRepository) { }

  async createPayment(
    createPaymentDto: CreatePaymentDto,
  ){
      const payment = await this.paymentRepo.createPayment(createPaymentDto);
      return { status: HttpStatus.CREATED, data: payment };
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

  async getGlobalPaymentStats(q: PaymentStatsQueryDto) {
    const { start, end } = this.resolveRange(q);
    const topLimit = q.topLimit ?? 5;

    const current = await this.paymentRepo.aggregateStats({
      start, end, groupBy: q.groupBy, topLimit, scope: { mode: 'GLOBAL' },
    });

    const previous = await this.previousPeriod({ start, end, topLimit, scope: { mode: 'GLOBAL' } });

    return {
      data: this.compose(q, start, end, current, previous),
    };
  }

  async getProviderPaymentStats(providerId: string, q: PaymentStatsQueryDto) {
    const { start, end } = this.resolveRange(q);
    const topLimit = q.topLimit ?? 5;

    const current = await this.paymentRepo.aggregateStats({
      start, end, groupBy: q.groupBy, topLimit, scope: { mode: 'PROVIDER', providerId },
    });

    const previous = await this.previousPeriod({
      start, end, topLimit, scope: { mode: 'PROVIDER', providerId },
    });

    return {
      data: this.compose(q, start, end, current, previous),
    };
  }

  private async previousPeriod(args: { start: string; end: string; topLimit: number; scope: any }) {
    const { start, end, topLimit, scope } = args;
    const delta = new Date(end).getTime() - new Date(start).getTime();
    const prevStart = new Date(new Date(start).getTime() - delta).toISOString();
    const prevEnd = new Date(start).toISOString();
    return this.paymentRepo.aggregateStats({
      start: prevStart,
      end: prevEnd,
      groupBy: GroupByType.NONE,
      topLimit,
      scope,
    });
  }

  private resolveRange(q: PaymentStatsQueryDto): { start: string; end: string } {
    const now = dayjs();
    switch (q.scope) {
      case ScopeType.ALL:
        return { start: '1970-01-01T00:00:00.000Z', end: now.add(1, 'minute').toISOString() };
      case ScopeType.LAST_WEEK: {
        const end = now.endOf('day');
        const start = end.subtract(7, 'day').add(1, 'second');
        return { start: start.toISOString(), end: end.toISOString() };
      }
      case ScopeType.LAST_30D: {
        const end = now.endOf('day');
        const start = end.subtract(30, 'day').add(1, 'second');
        return { start: start.toISOString(), end: end.toISOString() };
      }
      case ScopeType.MONTH: {
        const year = q.year ?? now.year();
        const month = q.month ?? now.month() + 1;
        const start = dayjs(`${year}-${String(month).padStart(2, '0')}-01`).startOf('month');
        const end = start.endOf('month');
        return { start: start.toISOString(), end: end.toISOString() };
      }
      case ScopeType.RANGE: {
        const start = q.start ? dayjs(q.start) : now.startOf('day');
        const end = q.end ? dayjs(q.end) : now.endOf('day');
        return { start: start.toISOString(), end: end.toISOString() };
      }
      default: {
        const end = now.endOf('day');
        const start = end.subtract(30, 'day').add(1, 'second');
        return { start: start.toISOString(), end: end.toISOString() };
      }
    }
  }

  private compose(
    q: PaymentStatsQueryDto,
    start: string,
    end: string,
    current: AggregateReturn,
    previous: AggregateReturn,
  ) {
    return {
      filters: { scope: q.scope, start, end, groupBy: q.groupBy },
      totals: current.totals,
      growth: {
        usersPct: pct(previous.totals.registeredUsers, current.totals.registeredUsers),
        providersPct: pct(previous.totals.registeredProviders, current.totals.registeredProviders),
        paymentsPct: pct(previous.totals.paymentsCount, current.totals.paymentsCount),
        revenuePct: pct(previous.totals.revenue, current.totals.revenue),
      },
      topServices: current.topServices,
      topProviders: current.topProviders,
      series: q.groupBy === GroupByType.NONE ? undefined : current.series,
    };
  }
}

function pct(prev: number, cur: number): number {
    if (!prev && !cur) return 0;
    if (!prev) return 100;
    return Number((((cur - prev) / prev) * 100).toFixed(2));
}
