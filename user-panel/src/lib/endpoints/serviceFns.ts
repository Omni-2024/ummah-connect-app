import { Service, GetAllServiceParams, Meta } from "@/types";
import Request, { catchAxiosErrorTyped } from "@/lib/http";



export const getAllServicesFn = async (params: GetAllServiceParams) => {
//   const {
//   setOffset,
//   setLimit,
//
// } =useExploreState()
  try {
    const res = await Request<GetAllCoursesFnRes>({
      method: "get",
      url: "/api/service/all",
      params,
    });
    return res.data;
  } catch (error) {
    console.error(error);
    // setLimit(9)
    // setOffset(0)
    return { data: [], meta: { total: 0, limit: null, offset: null } };
  }
};

export interface GetAllCoursesFnRes {
   data: Service[];
   meta: Meta;
}

/** Get - '/course/detail/:id' - get one course */
export const getOneServiceFn = async (id: string) => {
  try {
    const res = await Request<GetOneServiceDetailsFnRes>({
      method: "get",
      url: `/api/service/detail/${id}`,
    });
    return res.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

/** Get - '/course/detail/slug/:slug' - get one course by slug */
export const getOneServiceBySlugFn = async (slug: string) => {
  try {
    const res = await Request<GetOneServiceDetailsFnRes>({
      method: "get",
      url: `/api/service/detail/slug/${slug}`,
    });
    return res.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export interface GetOneServiceDetailsFnRes {
  id: string;
  title: string;
  tagline: string;
  description: string;
  coverImageUrl: string;
  modules: Module[];
  cmePoints: number;
  provider: Provider;
  price: number;
  cmeId: string;
  totalReviewScore: string;
  totalReviewCount: string;
  averageReviewScore: string;
  profession: Profession;
  discount: number;
  discountEnabled: boolean;
  duration: number;
  learningPoints: string[];
  specialty: Specialty;
  enrollmentCount: string;
  slug: string;
  isArchived: boolean;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  order: number;
  duration: number;
  videos: Video[];
}

export interface Video {
  id: string;
  title: string;
  description: string;
  coverImageUrl: string;
  recourseUrl: string[] | null;
  duration: number;
  order: number;
  videoUrl: string;
}

interface Provider {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  version: number;
  name: string;
  designation: string;
  bio: string;
  profileImageUrl: string;
}

interface Profession {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  version: number;
  name: string;
  price: number;
}



interface Specialty {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  version: number;
  name: string;
  price: number;
  professionId: string;
  typeId: string;
}

export enum CourseEnrollmentStatus {
  PURCHASE_NOW = "PURCHASE_NOW",
  ENROLL_NOW = "ENROLL_NOW",
  GO_TO_COURSE = "GO_TO_COURSE",
}

// export const getCourseEnrollmentStatusFn = async ({
//   uid,
//   course,
// }: {
//   uid: string;
//   course: GetOneServiceDetailsFnRes;
// }) => {
//   const [enrollError, enrollState] = await catchAxiosErrorTyped(
//     getEnrollmentStatusFn({
//       cid: course.id,
//       uid: uid,
//     }),
//   );
//   //
//   const [paymentError, paymentState] = await catchAxiosErrorTyped(
//     getPaymentByIdFn(uid, course.id),
//   );
//   //
//   if (!enrollError && enrollState) {
//     // User is enrolled
//     return CourseEnrollmentStatus.GO_TO_COURSE;
//   } else {
//     if (course.price === 0) {
//       // Free course
//       return CourseEnrollmentStatus.ENROLL_NOW;
//     } else {
//       // Paid course
//       if (!paymentError && paymentState) {
//         // User has paid
//         return CourseEnrollmentStatus.ENROLL_NOW;
//       } else {
//         // User has not paid
//         return CourseEnrollmentStatus.PURCHASE_NOW;
//       }
//     }
//   }
// };
