import Request from "@/lib/http";
import { isAxiosError } from "axios";
import { Meta} from "@/lib/endpoints/serviceFns";


export enum ScopeType {
  ALL = 'all',
  LAST_WEEK = 'last_week',
  LAST_30D = 'last_30d',
  MONTH = 'month',
  RANGE = 'range',
}

export enum GroupByType {
  NONE = 'none',
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
}


export interface GetStatsParams {
  scope?: ScopeType;
  groupBy?: GroupByType;
  month?: number;
  year?: number;
  start?: string;
  end?: string;
  providerId?: string;
  topLimit?: number;
}

export interface Payment {
  userId: string;
  serviceId: string;
  serviceName: string;
  status: 'failed' | 'pending' | 'succeeded';
  receiptUrl: string;
  last4: string;
  paymentMethod: string;
  paymentIntent: string;
  amount: number;
  chargeId: string;
  createdAt: string;
  updatedAt: string;
  amount_gross?: number;
  provider_amount?: number;
  platform_fee_amount?: number;
  stripeTransferId: string;
  providerTransferStatus: 'pending' | 'transferred';
  providerTransferredAt: Date;
}

export interface StatsFilters {
  scope: ScopeType;
  start: string;   // ISO
  end: string;     // ISO
  groupBy: GroupByType;
}

export interface StatsTotals {
  revenue: number;
  paymentsCount: number;
  registeredUsers: number;
  registeredProviders: number;
}

export interface StatsGrowth {
  usersPct: number;        // +/- %
  providersPct: number;        // +/- %
  paymentsPct: number;     // +/- %
  revenuePct: number;      // +/- %
}

export interface TopService {
  serviceId: string;
  // serviceName: string | null;
  orders: number;
  revenue: number;
}

export interface TopProvider {
  providerId: string;
  providerName: string | null;
  orders: number;
  revenue: number;
}

export interface StatsPoint {
  period: string;
  revenue: number;
  paymentsCount: number;
}

export interface GetStatsData {
  filters: StatsFilters;
  totals: StatsTotals;
  growth: StatsGrowth;
  topServices: TopService[];
  topProviders: TopProvider[];
  series?: StatsPoint[];
}

export interface GetStatsFnRes {
  data: GetStatsData ;
}
const EMPTY_STATS: GetStatsFnRes = {
  data: {
    filters: {
      scope: ScopeType.LAST_30D,
      start: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(),
      end: new Date().toISOString(),
      groupBy: GroupByType.DAY,
    },
    totals: {
      revenue: 0,
      paymentsCount: 0,
      registeredUsers: 0,
      registeredProviders: 0,
    },
    growth: {
      usersPct: 0,
      providersPct: 0,
      paymentsPct: 0,
      revenuePct: 0,
    },
    topServices: [],
    topProviders: [],
    series: [],
  },
};

export interface GetAllPaymentsFnRes {
  data: Payment[];
  meta: Meta;
}

export const getStatsFn = async (params: GetStatsParams) => {
  try {
    const res = await Request<GetStatsFnRes>({
      method: "get",
      url: "/api/payment/stats/summary",
      params,
    });
    return res.data;
  } catch (error) {
    console.error(error);
    return EMPTY_STATS
  }
};

interface GetAllPaymentFns{

    limit: number;
    offset: number;

}
export const getPayments = async (
    params: GetAllPaymentFns
) => {
    try {
        const res = await Request<GetAllPaymentsFnRes>({
            method: "get",
            url: "/api/payment/",
            params: params,
        });

        return res.data;
    } catch (e) {
        if (isAxiosError(e)) {
            if (e.response?.status === 404) {
                return {
                    data: [],
                    meta: {
                        total: 0,
                        page: 1,
                        totalPages: 1,
                        limit: 10,
                    },
                };
            }
        }
        throw e;
    }

    //
};

export const getPaymentsByUserIdFn = async (
  userId: string,
  limit: number,
  offset: number,
) => {
  try {
    const res = await Request<GetAllPaymentsFnRes>({
      method: "get",
      url: "/api/payment/user",
      params: { userId, limit, offset },
    });

    return res.data;
  } catch (e) {
    if (isAxiosError(e)) {
      if (e.response?.status === 404) {
        return {
          data: [],
          meta: {
            total: 0,
            page: 1,
            totalPages: 1,
            limit: 10,
          },
        };
      }
    }
    throw e;
  }

  //
};

// get payments by service id
export const getPaymentsByServiceFn = async (id: string) => {
  try {
    const res = await Request<GetAllPaymentsFnRes>({
      method: "get",
      url: `/api/payment/service/${id}`,
    });
    return res.data;
  } catch (e) {
    if (isAxiosError(e)) {
      if (e.response?.status === 404) {
        return {
          data: [],
          meta: {
            total: 0,
            page: 1,
            totalPages: 1,
            limit: 10,
          },
        };
      }
    }
    throw e;
  }
};

export const getPaymentByIdFn = async (userId: string, serviceId: string) => {
  const res = await Request<Payment>({
    method: "get",
    url: `/api/payment/single/payment`,
    params: { userId, serviceId },
  });
  return res.data;
};

