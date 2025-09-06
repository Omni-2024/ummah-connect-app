import { SIGNIN_METHOD, UserRole } from "@/lib/constants";
import { getErrorMessage } from "@/lib/helpers/errors";
import Request from "@/lib/http";
import { AxiosError } from "axios";

/** Patch - '/user/{id}' - update user account */
export const updateUserFn = async (data: {
  id: string;
  name?: string;
  designations?: string[];
  interests?: string[];
  profileImage?: string;
  contactNumber?: string;
  company?: string;
  country?: string;
  specializations?: string;
}) => {
  const res = await Request<GetUpdateUserByIdFnRes>({
    method: "patch",
    url: `/api/user/${data.id}`,
    data,
  });
  return res.data;
};

/** Get - '/user/{id}' - get user by id */
export const getUserByIdFn = async (id: string) => {
  const res = await Request<GetUpdateUserByIdFnRes>({
    method: "get",
    url: `/api/user/${id}`,
  });
  return res.data;
};

export interface GetUpdateUserByIdFnRes {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  version: number;
  name: string;
  email: string;
  password: string | null;
  token: string | null;
  role: UserRole;
  salt: string | null;
  active: boolean;
  verified: boolean;
  stripeId: string | null;
  designations: string[];
  interests: string[];
  profileImage: string;
  specializations: string; //added
  company: string;
  country: string;
  contactNumber: string;
  averageScore: number | null;
  totalCme: number | null;
  totalCourses: number | null;
  totalCoursesCompleted: number | null;
  totalActiveCourses: number | null;
  isFirstLogin: boolean;
  signinMethod: SIGNIN_METHOD;
}

/** Delete - '/user/{id}' - delete user account */
export const deleteUserFn = async (id: string) => {
  const res = await Request({
    method: "delete",
    url: `/api/user/${id}/delete`,
  });
  return res.data;
};

export const addSubscriber = async (data: any) => {
  try {
    const res = await Request<any>({
      method: "post",
      url: `/api/subscribe`,
      data,
    });
    return res;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 409) {
        throw new Error("Email already subscribed");
      }
      throw new Error(getErrorMessage(error));
    }
    throw new Error("Something went wrong!");
  }
};
