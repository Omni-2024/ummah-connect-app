import Request from "@/lib/http";


export const getOnboardingLinkFn = async (accountId: string) => {
  const res = await Request<Response>({
    method: "get",
    url: "/api/stripe/onboarding-link",
    params: { accountId },
  });
  return res.data;
};

export const getAccountStats = async (accountId: string) => {
    const res = await Request<ResponseStats>({
        method: "get",
        url: "/api/stripe/connected-account-status",
        params: { accountId },
    });
    return res.data;
};

export interface Response {
  url: string;
}
export interface ResponseStats {
    chargesEnabled: boolean;
    payoutsEnabled: boolean;
}

