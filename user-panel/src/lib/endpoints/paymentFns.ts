import { Meta } from "@/types";
import Request from "@/lib/http";
import { isAxiosError } from "axios";

/** Post - '/create-checkout-session' - create a checkout session */
export const createCheckoutSessionFn = async ({
  serviceId,
  userId,
  mode,
}: CreateCheckoutSessionParams) => {
  const res = await Request<CreateCheckoutSessionRes>({
    method: "post",
    url: "/api/stripe/create-checkout-session",
    data: { serviceId, userId, mode },
  });
  //
  return res.data;
};

export interface CreateCheckoutSessionParams {
  userId: string;
  serviceId?: string;
  mode: 'embedded' | 'hosted';
}

export interface CreateCheckoutSessionRes {
  status: number;
  data: {
    clientSecret: string;
    session: StripeCheckoutSession;
  };
}

/** Get - '/session-status?session_id=' - get session status */
export const getSessionStatusFn = async (sessionId: string) => {
  const res = await Request<Session>({
    method: "get",
    url: "/api/stripe/session-status",
    params: { sessionId },
  });
  return res.data;
};

export interface Session {
  status: "open" | "complete" | "error";
  metadata: {
    service_id: string;
    user_id: string;
    service_name: string;
  };
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
}

export interface GetAllPaymentsFnRes {
  // Define the structure of the response data here
  data: Payment[];
  meta: Meta;
}

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

export interface StripeCheckoutSession {
  id: string;
  object: string;
  adaptive_pricing?: {
    enabled: boolean;
  };
  after_expiration?: any;
  allow_promotion_codes?: any;
  amount_subtotal: number;
  amount_total: number;
  automatic_tax?: {
    enabled: boolean;
    liability?: any;
    status?: any;
  };
  billing_address_collection?: any;
  cancel_url?: string | null;
  client_reference_id?: any;
  client_secret?: string | null;
  consent?: any;
  consent_collection?: any;
  created: number;
  currency: string;
  currency_conversion?: any;
  custom_fields: any[];
  custom_text: {
    after_submit?: any;
    shipping_address?: any;
    submit?: any;
    terms_of_service_acceptance?: any;
  };
  customer: string;
  customer_creation?: any;
  customer_details?: {
    address?: any;
    email?: string;
    name?: string | null;
    phone?: string | null;
    tax_exempt?: string;
    tax_ids?: any;
  };
  customer_email?: string | null;
  expires_at: number;
  invoice?: any;
  invoice_creation?: {
    enabled: boolean;
    invoice_data: {
      account_tax_ids?: any;
      custom_fields?: any;
      description?: any;
      footer?: any;
      issuer?: any;
      metadata: Record<string, any>;
      rendering_options?: any;
    };
  };
  livemode: boolean;
  locale?: any;
  metadata: {
    service_id: string;
    service_name: string;
    user_id: string;
  };
  mode: string;
  payment_intent?: any;
  payment_link?: any;
  payment_method_collection: string;
  payment_method_configuration_details?: any;
  payment_method_options?: {
    card?: {
      request_three_d_secure: string;
    };
  };
  payment_method_types: string[];
  payment_status: string;
  phone_number_collection?: {
    enabled: boolean;
  };
  recovered_from?: any;
  redirect_on_completion?: string | null;
  return_url?: string | null;
  saved_payment_method_options?: {
    allow_redisplay_filters: string[];
    payment_method_remove?: any;
    payment_method_save: string;
  };
  setup_intent?: any;
  shipping_address_collection?: any;
  shipping_cost?: any;
  shipping_details?: any;
  shipping_options: any[];
  status: string;
  submit_type?: any;
  subscription?: any;
  success_url?: string | null;
  total_details?: {
    amount_discount: number;
    amount_shipping: number;
    amount_tax: number;
  };
  ui_mode: string;
  url?: string | null;
}