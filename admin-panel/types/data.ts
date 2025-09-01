export enum Roles {
  User = "user",
  Admin = "admin",
  Moderator = "moderator",
}

export interface UserData {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  version: number;
  name: string;
  email: string;
  token: string;
  role: Roles;
  active: boolean;
  verified: boolean;
  stripeId: string | null;
  designations: string[];
  interests: string[];
  profileImage: string | null;
  specializations: string;
  company: string | null;
  country: string;
  averageScore: number | null;
  totalCme: number | null;
  totalCourses: number | null;
  totalCoursesCompleted: number | null;
  totalActiveCourses: number | null;
  isFirstLogin: boolean;
  subscription?: {
    title: string;
    description: string;
  };
}

export type QueryListResponse<T> = {
  data: T[];
  meta: {
    total: number;
  };
};

export type CourseData = {
  id: string;
  title: string;
  image: string;
  category: string;
  educator: string;
  CME_points: number;
  duration: string;
  CME_Id: string;
};

export type WebinarData = {
  id: string;
  title: string;
  image: string;
  category: string;
  educator: string;
  CME_points: number;
  duration: string;
  CME_Id: string;
};

export type EducatorData = {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  version: number;
  name: string;
  designation: string;
  bio: string;
  profileImageUrl: string;
  courseCount: number;
  webinarCount: number;
  enrollmentCount: string;
  webinarEnrollmentCount: string;

};

export type SpecialistData = {
  id: string;
  name: string;
  price: number;
  professionId: string;
  typeId: string;
};

export type ProfessionTypeData = {
  id: string;
  name: string;
  price: number;
  professionId: string;
  specialist: SpecialistData[];
};

export type CategoryData = {
  id: string;
  name: string;
  price: number;
  order: number;
  profession: ProfessionTypeData[];
};

export type SubscriberData = {
  id: string;
  createdAt: string;
  email: string;
};
