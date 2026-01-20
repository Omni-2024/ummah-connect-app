import { getErrorMessage } from "@/lib/helpers/errors";
import Request from "@/lib/http";
import { AxiosError } from "axios";

/** Post - '/enrollment' - enroll user to a service */
export const enrollUserToServiceFn = async (data: EnrollUserToServiceParams) => {
  try {
    const res = await Request<EnrollUserToServiceFnRes>({
      method: "post",
      url: `/api/enrollment`,
      params: {
        _action: "enroll",
        _callback: encodeURIComponent(`/service/${data.serviceId}`),
      },
      data,
    });
    return res.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(getErrorMessage(error));
    }
    throw new Error("Something went wrong!");
  }
};

export const completeUserToServiceFn = async (data: EnrollUserToServiceParams) => {
  try {
    const res = await Request<EnrollUserToServiceFnRes>({
      method: "post",
      url: `/api/enrollment/complete`,
      params: {
        _action: "complete",
        _callback: encodeURIComponent(`/service/${data.serviceId}`),
      },
      data,
    });
    return res.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(getErrorMessage(error));
    }
    throw new Error("Something went wrong!");
  }
};

export interface EnrollUserToServiceParams {
  serviceId: string;
  userId: string;
}

export interface EnrollUserToServiceFnRes {
  // Define the structure of the response data here
}

/** Get - '/enrollment/status' - get enrollment details of a user for a service */
export const getEnrollmentStatusFn = async ({
  uid,
  cid,
}: GetEnrollmentStatusParams) => {
  const res = await Request<GetEnrollmentStatusFnRes>({
    method: "get",
    url: `/api/enrollment/status`,
    params: {
      serviceId: cid,
      userId: uid,
    },
  });
  return res.data;
};

export interface GetEnrollmentStatusParams {
  uid: string;
  cid: string;
}

export interface GetEnrollmentStatusFnRes {
  completed: boolean;
  reviewed: boolean;
  serviceId: string;
  userId: string;
  enrollmentId: string;
  enrollmentDate: string;
  completedAt: string | null;
}

/** Post - '/enrollment/update' - update video status */
export const updateEnrollmentFn = async (data: UpdateEnrollmentParams) => {
  try {
    const res = await Request<UpdateEnrollmentFnRes>({
      method: "post",
      url: `/api/enrollment/update`,
      data,
    });
    return res.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(getErrorMessage(error));
    }
    throw new Error("Something went wrong!");
  }
};

export interface UpdateEnrollmentParams {
  userId: string;
  serviceId: string;
  status: "completed" | "not-started" | "in-progress";
}

export interface UpdateEnrollmentFnRes {
  // Define the structure of the response data here
}

/** Get - '/enrollment?id={uid}' - get enrolled services of a user */
export const getEnrolledServiceFn = async (uid: string) => {
  try {
    const res = await Request<GetEnrolledServicesFnRes[]>({
      method: "get",
      url: "/api/enrollment",
      params: { id: uid },
    });
    return res.data;
  } catch (error) {
    return [];
  }
};

export interface GetEnrolledServicesFnRes {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  version: number;
  enrollmentDate: string;
  userId: string;
  serviceId: string;
  completedAt: string | null;
  completed: boolean;
}

/** Get - '/enrollment/active?id={uid}' - get active enrolled services of a user */
export const getActiveEnrolledServicesFn = async (uid: string) => {
  try {
    const res = await Request<GetEnrolledServicesFnRes[]>({
      method: "get",
      url: "/api/enrollment/active",
      params: { id: uid },
    });
    return res.data;
  } catch (error) {
    return [];
  }
};

/** Get - '/enrollment/completed?id={uid}' - get completed enrolled services of a user */
export const getCompletedEnrolledServicesFn = async (uid: string) => {
  try {
    const res = await Request<GetEnrolledServicesFnRes[]>({
      method: "get",
      url: "/api/enrollment/completed",
      params: { id: uid },
    });
    return res.data;
  } catch (error) {
    return [];
  }
};


