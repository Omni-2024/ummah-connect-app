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
  courseId: string;
  courseName: string;
  status: 'failed' | 'pending' | 'succeeded';
  receiptUrl: string;
  last4: string;
  paymentMethod: string;
  paymentIntent: string;
  amount: number;
  chargeId: string;
  createdAt: string;
  updatedAt: string;
}

export interface StatsFilters {
  scope: ScopeType;
  start: string;   // ISO
  end: string;     // ISO
  groupBy: GroupByType;
}

export interface StatsTotals {
  revenue: number;         // same unit as your PaymentEntity.amount
  paymentsCount: number;
  uniqueUsers: number;
  uniqueProviders: number; // for provider scope this will be 1 or 0
}

export interface StatsGrowth {
  usersPct: number;        // +/- %
  paymentsPct: number;     // +/- %
  revenuePct: number;      // +/- %
}

export interface TopService {
  serviceId: string;
  serviceName: string | null;
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
    return { data: {
        filters: {
          scope: ScopeType.LAST_30D,
          start: '',
          end: '',
          groupBy: GroupByType.DAY
        },
        totals: {
          revenue: 0,
          paymentsCount: 0,
          uniqueUsers: 0,
          uniqueProviders: 0
        },
        growth: {
          usersPct: 0,
          paymentsPct: 0,
          revenuePct: 0
        },
        topServices: [],
        topProviders: [],
        series: []
      }
    };
  }
};

export const getPaymentsByUserIdFn = async (
  userId: string,
  limit: number,
  offset: number,
) => {
  try {
    const res = await Request<GetAllPaymentsFnRes>({
      method: "get",
      url: "/payment/user",
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

// get payments by course id
export const getPaymentsByCourseIdFn = async (id: string) => {
  try {
    const res = await Request<GetAllPaymentsFnRes>({
      method: "get",
      url: `/payment/course/${id}`,
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

export const getPaymentByIdFn = async (userId: string, courseId: string) => {
  const res = await Request<Payment>({
    method: "get",
    url: `/payment/single/payment`,
    params: { userId, courseId },
  });
  return res.data;
};

