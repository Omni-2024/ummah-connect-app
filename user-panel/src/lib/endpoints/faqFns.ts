import Request from "@/lib/http";

export const getQuestionsFn = async (
    serviceId: string,
) => {
  const res = await Request<QuestionDBtype[]>({
    method: "get",
    url: "/api/faq",
    params: { serviceId },
  });
  return res.data;
};

export const getQuestionFn = async (id: string) => {
  const res = await Request<QuestionDBtype>({
    method: "get",
    url: `/api/faq/${id}`,
  });
  return res.data;
};

export const addQuestionFn = async (data: AddQuestionType) => {
  const res = await Request<AddAssessmentType>({
    method: "post",
    url: "/api/faq",
    data: data,
  });
  return res.data;
};



export interface AddQuestionType {
  serviceId: string;
  order: number;
  question: string;
  answer:string ;
}

export interface AddQuestionResponse {
  serviceId: string;
  question: string;
  order: number;
  answer: string;
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  version: number;
}


export const removeQuestionFn = async (id: string) => {
  const res = await Request<AddAssessmentType>({
    method: "delete",
    url: `/api/faq/${id}`,
  });
  return res.data;
};

export const updateQuestionFn = async ({
  id,
  data,
}: {
  id: string;
  data: UpdateQuestionType;
}) => {
  const res = await Request<AddQuestionResponse>({
    method: "patch",
    url: `/api/faq/${id}`,
    data: data,
  });
  return res.data;
};





export interface UpdateQuestionType {
  serviceId?: string;
  order?: number;
  question?: string;
  answer?: string;
}

export interface QuestionDBtype {
  id: string;
  serviceId: string;
  question: string;
  order: number;
  answer:string
}

export interface AddAssessmentType {
  id: string;
  title: string;
  learningPoints: string[];
  correctAnswer: string;
  order: number;

  new?: boolean;
  videoTimestamp: {
    module: string;
    video: string;
    timestamp: {
      hours: number;
      minutes: number;
      seconds: number;
    };
  };
  questionId?: string;
}

