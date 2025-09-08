export type CategoriesPageData = {
  profession: string;
  specialist: string | null;
  provider: string;
};

export type ServiceDetailsPageData = {
  serviceTitle: string;
  serviceDescription: string;
  coverImage: string;
  previewDescription: string;
  learningPoints: string[];
  pricing: number;
  discount: number;
  discountOn: boolean;
};

export type addPageActions = {
  onSubmit: () => void;
  OnBack: () => void;
  onDraft: () => void;
};

export interface ServiceDetailsAPI {
  id: string;
  title: string;
  tagline: string;
  description: string;
  coverImageUrl: string;

  provider: {
    id: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | undefined;
    version: number;
    name: string;
    designation: string;
    bio: string;
    profileImageUrl: string;
  };
  price: number;
  totalReviewScore: string;
  totalReviewCount: string;
  averageReviewScore: string;
  profession: {
    id: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | undefined;
    version: number;
    name: string;
    price: number;
  };
  discount: number;
  discountEnabled: boolean;
  duration: number;
  learningPoints: string[];
  specialty: {
    id: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    version: number;
    name: string;
    price: number;
    professionId: string;
    typeId: string;
  };
  slug: string;
}
