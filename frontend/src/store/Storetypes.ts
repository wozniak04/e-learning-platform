export interface CourseInfo {
  title: string;
  description: string;
  quick_description: string;
  owner_name: string;
  imgsrc?: string;
  type?: string;
}
export interface CourseInfoStore {
  coursesInfo: { [url: string]: CourseInfo };
  isLoading: boolean;
  fetchCoursesInfo: (page: number) => Promise<void>;
  fetchCourseInfoByUrl: (courseUrl: string) => Promise<CourseInfo | null>;
  updateCourseInfo: (
    courseUrl: string,
    updatedInfo: Partial<CourseInfo>
  ) => void;
  addNewCourseInfo: (courseUrl: string, info: CourseInfo) => void;
  getCourseInfoToCards: (page: number) => Promise<CourseCard[]>;
  getCourseInfoToDetail: (courseUrl: string) => Promise<CourseDetail | null>;
  clearStore: () => void;
}
export interface CourseCard {
  title: string;
  description: string;
  url: string;
  imgsrc: string;
}

export interface CourseDetail {
  title: string;
  description?: string;
  owner_name: string;
  imgsrc?: string;
  type?: string;
}

export interface savedCourse {
  url: string;
  page: Number;
}

export interface savedCourseState {
  savedCourses: savedCourse[];
  isLoading: boolean;
  isInSavedCourse: (id: string) => boolean;
  addToSavedCourses: (id: string) => Promise<void>;
  removeFromSavedCourse: (id: string) => Promise<void>;
  getPageOfSavedCourse: (id: string) => Number | null;
  fetchsavedCourses: () => Promise<savedCourse[]>;

  clearStore: () => void;
}

export interface CourseMaterial {
  title: string;
  content: string;
  page: number;
}
export interface CourseMaterialState {
  courseMaterials: { [url: string]: CourseMaterial[] };
  isLoading: boolean;
  setCourseMaterials: (
    url: string,
    materials: CourseMaterial[]
  ) => Promise<void>;
  fetchCourseMaterials: (courseUrl: string) => Promise<CourseMaterial[]>;
  clearStore: () => void;
}
export interface CourseComments {
  user: string;
  comment: string;
  date: string;
  rate: number;
}
export interface CourseCommentsStore {
  comments: {
    [url: string]: { average_rating: number; comments: CourseComments[] };
  };
  isLoading: boolean;
  setComments: (url: string, comments: CourseComments[]) => void;
  fetchComments: (courseUrl: string) => Promise<CourseComments[] | void>;
  addComment: (courseUrl: string, comment: CourseComments) => void;
  clearStore: () => void;
}
