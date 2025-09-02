export interface Service {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  version: number;
  title: string;
  tagline: string;
  description: string;
  cmePoints: number;
  coverImageUrl: string;
  providerId: string;
  price: number;
  cmeId: string;
  totalReviewScore: string;
  totalReviewCount: string;
  averageReviewScore: string;
  specialtyId: string;
  typeId: string;
  professionId: string;
  learningPoints: string[];
  discount: number;
  discountEnabled: boolean;
  duration: number;
  isPublished: boolean;
  isArchived: boolean;
  enrollmentCount: string;
  slug: string;
}

// TODO:: update with real data format
export interface ServiceReview {
  id: string;
  createdAt: string;
  courseId: string;
  review: string;
  rating: number;

  // couldn't find the user data type
  user: {
    id: string;
    name: string;
    profileImage: string;
  };
}

export interface Meta {
  total: number;
  limit: number | null;
  offset: number | null;
}

export interface GetAllServiceParams {
  limit?: number;
  offset?: number;
  search?: string;
  provider?: string;
  profession?: string;
  specialties?: string[];
  isPopular?: boolean;
}

export interface Specialist {
  id: string;
  name: string;
  price: number;
  professionId: string;
}


export interface Profession {
  id: string;
  name: string;
  price: number;
}

export type CardTypes =
  | "Visa"
  | "Mastercard"
  | "Alipay"
  | "Amex"
  | "Code"
  | "Diners"
  | "Discover"
  | "Elo"
  | "Generic"
  | "Hiper"
  | "Hipercard"
  | "Jcb"
  | "Maestro"
  | "Mir"
  | "Paypal"
  | "Unionpay";

export type PaymentCard = {
  id: string;
  name: string;
  logoName: CardTypes;
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  isDefault: boolean;
};
