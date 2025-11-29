import {
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { PaymentEntity } from './payment.entity';
import { Service } from '../services/entities/service.entity';
import { UserEntity } from '../users/entities/user.entity';
import { UserRole } from '../users/entities/abstract.user.entity';

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
    registeredUsers: number;
    registeredProviders: number;
  };
  topServices: Array<{ serviceId: string; serviceName: string | null; orders: number; revenue: number }>;
  topProviders: Array<{ providerId: string; orders: number; revenue: number }>;
  series: Array<{ period: string; revenue: number; paymentsCount: number }>;
};


@Injectable()
export class PaymentRepository {
  constructor(
    @InjectRepository(PaymentEntity)
    private readonly paymentRepository: Repository<PaymentEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
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

  // async getAllPayments(): Promise<PaymentEntity[]> {
  //   return await this.paymentRepository.find();
  // }

  // Method to get all payments by userId
  // async findAllByUserId(userId: string): Promise<PaymentEntity[]> {
  //   return this.paymentRepository.find({ where: { userId } });
  // }

  async getAllPayments({
                          limit,
                          offset,
                        }: {
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
        ...options
      });

      return { paymentList, count };
    } catch (error) {
      throw error;
    }
  }

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

      const amountField =
        scope.mode === 'GLOBAL'
          ? 'p.platform_fee_amount'
          : 'p.provider_amount';

      // base payments query
      const baseQB = this.paymentRepository
        .createQueryBuilder('p')
        .leftJoin(Service, 's', 's._id = p.service_id')
        .where('p.created_at >= :start', { start })
        .andWhere('p.created_at < :end', { end })
        .andWhere('p.status = :ok', { ok: 'succeeded' });

      if (scope.mode === 'PROVIDER') {
      baseQB.andWhere('s.provider_id = :providerId', { providerId: scope.providerId });
    }

    // payments-based totals (revenue, orders)
    const payTotals = await baseQB
      .clone()
      .select(`COALESCE(SUM(${amountField}) * 100, 0)`, 'revenue')
      .addSelect('COUNT(*)', 'paymentsCount')
      .getRawOne<{ revenue: string | number; paymentsCount: string | number }>();

    // registrations (ONLY thing we report for users/providers)
    const [registeredUsers, registeredProviders] = await Promise.all([
      this.userRepo
        .createQueryBuilder('u')
        .where('u.role = :role', { role: UserRole.USER })
        .andWhere('u.created_at >= :start', { start })
        .andWhere('u.created_at < :end', { end })
        .getCount(),
      this.userRepo
        .createQueryBuilder('u')
        .where('u.role = :role', { role: UserRole.BUSINESS_ADMIN })
        .andWhere('u.created_at >= :start', { start })
        .andWhere('u.created_at < :end', { end })
        .getCount(),
    ]);

    const totals = {
      revenue: Number(payTotals?.revenue ?? 0),
      paymentsCount: Number(payTotals?.paymentsCount ?? 0),
      registeredUsers,
      registeredProviders,
    };

    // top services
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

    const topServices = topServicesRaw.map((r: any) => ({
      serviceId: r.serviceId as string,
      serviceName: (r.serviceName as string) ?? null,
      orders: Number(r.orders),
      revenue: Number(r.revenue),
    }));

    // top providers
    const topProvidersRaw = await baseQB.clone()
      .select('s.provider_id', 'providerId')
      .addSelect('COUNT(*)', 'orders')
      .addSelect('COALESCE(SUM(p.amount), 0)', 'revenue')
      .andWhere('s.provider_id IS NOT NULL')
      .groupBy('s.provider_id')
      .orderBy('revenue', 'DESC')
      .addOrderBy('orders', 'DESC')
      .limit(topLimit)
      .getRawMany();

    const topProviders = topProvidersRaw.map((r: any) => ({
      providerId: r.providerId as string,
      orders: Number(r.orders),
      revenue: Number(r.revenue),
    }));

    // time series
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

      series = seriesRaw.map((r: any) => ({
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
