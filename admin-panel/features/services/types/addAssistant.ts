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

export interface AddWebinarAssessmentType {
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

// "title": "Final Exam",
// "description": "This is the final exam covering all course materials.",
// "timeLimit": 15,
// "passingScore": 60
export interface AddHigherAssessment {
  id: string;
  new?: boolean;
  title: string;
  description: string;
  timeLimit: number;
  passingScore: number;
}

export interface QuestionDBtype {
  id: string;
  courseId: string;
  assessmentId: string;
  question: string;
  order: number;
  moduleId: string;
  videoId: string;
  time: number;
  answers: {
    answer: string;
    correct: boolean;
  }[];
}
