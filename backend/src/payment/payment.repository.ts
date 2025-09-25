import {
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { PaymentEntity } from './payment.entity';
import { Service } from '../services/entities/service.entity';

export type AggregateArgs = {
  start: string;
  end: string;
  groupBy: 'none' | 'day' | 'week' | 'month';
  topLimit: number;
  scope:
    | { mode: 'GLOBAL' }
    | { mode: 'PROVIDER'; providerId: string };
};

export type AggregateReturn = {
  totals: {
    revenue: number;
    paymentsCount: number;
    uniqueUsers: number;
    uniqueProviders: number;
  };
  topServices: Array<{ serviceId: string; serviceName: string | null; orders: number; revenue: number }>;
  topProviders: Array<{ providerId: string;  orders: number; revenue: number }>;
  series: Array<{ period: string; revenue: number; paymentsCount: number }>;
};


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

  async aggregateStats(args: AggregateArgs): Promise<AggregateReturn> {
    const { start, end, groupBy, topLimit, scope } = args;

    const baseQB = this.paymentRepository
      .createQueryBuilder('p')
      .leftJoin(Service, 's', 's.id = p.service_id')
      .where('p.created_at >= :start', { start })
      .andWhere('p.created_at < :end', { end })
      .andWhere('p.status = :ok', { ok: 'succeeded' });

    if (scope.mode === 'PROVIDER') {
      baseQB.andWhere('s.providerId = :providerId', { providerId: scope.providerId });
    }

    const totalsRaw = await baseQB.clone()
      .select('COALESCE(SUM(p.amount), 0)', 'revenue')
      .addSelect('COUNT(*)', 'paymentsCount')
      .addSelect('COUNT(DISTINCT p.user_id)', 'uniqueUsers')
      .addSelect('COUNT(DISTINCT s.providerId)', 'uniqueProviders')
      .getRawOne();

    const totals = {
      revenue: Number(totalsRaw?.revenue ?? 0),
      paymentsCount: Number(totalsRaw?.paymentsCount ?? 0),
      uniqueUsers: Number(totalsRaw?.uniqueUsers ?? 0),
      uniqueProviders: Number(totalsRaw?.uniqueProviders ?? 0),
    };

    const topServicesRaw = await baseQB.clone()
      .select('p.service_id', 'serviceId')
      .addSelect('MAX(p.serviceName)', 'serviceName')
      .addSelect('COUNT(*)', 'orders')
      .addSelect('COALESCE(SUM(p.amount), 0)', 'revenue')
      .groupBy('p.service_id')
      .orderBy('revenue', 'DESC')
      .addOrderBy('orders', 'DESC')
      .limit(topLimit)
      .getRawMany();

    const topServices = topServicesRaw.map(r => ({
      serviceId: r.serviceId,
      serviceName: r.serviceName,
      orders: Number(r.orders),
      revenue: Number(r.revenue),
    }));

    // -------- top providers --------
    const topProvidersRaw = await baseQB.clone()
      .select('s.providerId', 'providerId')
      // .addSelect('MAX(s.providerName)', 'providerName') // adjust if column differs
      .addSelect('COUNT(*)', 'orders')
      .addSelect('COALESCE(SUM(p.amount), 0)', 'revenue')
      .where('s.providerId IS NOT NULL')
      .groupBy('s.providerId')
      .orderBy('revenue', 'DESC')
      .addOrderBy('orders', 'DESC')
      .limit(topLimit)
      .getRawMany();

    const topProviders = topProvidersRaw.map(r => ({
      providerId: r.providerId,
      // providerName: r.providerName,
      orders: Number(r.orders),
      revenue: Number(r.revenue),
    }));

    // -------- time series --------
    let series: Array<{ period: string; revenue: number; paymentsCount: number }> = [];
    if (groupBy !== 'none') {
      const trunc = groupBy === 'day' ? 'day' : groupBy === 'week' ? 'week' : 'month';
      const seriesRaw = await baseQB.clone()
        .select(`DATE_TRUNC('${trunc}', p.created_at)`, 'period')
        .addSelect('COALESCE(SUM(p.amount), 0)', 'revenue')
        .addSelect('COUNT(*)', 'paymentsCount')
        .groupBy(`DATE_TRUNC('${trunc}', p.created_at)`)
        .orderBy('period', 'ASC')
        .getRawMany();

      series = seriesRaw.map(r => ({
        period: (r.period as Date).toISOString().slice(0, 10),
        revenue: Number(r.revenue),
        paymentsCount: Number(r.paymentsCount),
      }));
    }

    return { totals, topServices, topProviders, series };
  }


}



interface FindOptions {
  take?: number;
  skip?: number;
}
