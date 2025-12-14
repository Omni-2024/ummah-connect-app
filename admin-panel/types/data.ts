export enum Roles {
  User = "user",
  Admin = "admin",
  BusinessAdmin = "business_admin",
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
}

export interface UserData {
  languages: string[];
  bio: string;
  contactNumber: string;
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  version: number;
  name: string;
  email: string;
  token: string;
  role: Roles;
  gender:Gender;
  active: boolean;
  verified: boolean;
  stripeId: string | null;
  stripeConnectAccountId:string | null;
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
  sameGenderAllow:boolean;
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

export type SpecialistData = {
  id: string;
  name: string;
  price: number;
  professionId: string;
};

export type ProfessionTypeData = {
  id: string;
  name: string;
  price: number;
  professionId: string;
  specialists: SpecialistData[];
};

export type CategoryData = {
  id: string;
  name: string;
  price: number;
  order: number;
  specialists: SpecialistData[];
};

export type SubscriberData = {
  id: string;
  createdAt: string;
  email: string;
};
