export interface FetchCourseInfoParams {
  search?: string;
  type?: string;
  sort?: string;
  onlysaved?: boolean;
}
export interface CourseInfo {
  title: string;
  description: string;
  quick_description: string;
  owner_name: string;
  img?: string;
  type?: string;
  material_count: number;
  created_at: Date | null;
}
export interface CourseInfoStore {
  coursesInfo: { [url: string]: CourseInfo };
  coursesCard: CourseCard[]
  totalCount: number;
  isLoading: boolean;
  fetchCoursesInfo: (page: number, params: FetchCourseInfoParams) => Promise<void>;
  fetchCourseInfoByUrl: (courseUrl: string) => Promise<CourseInfo | null>;
  updateCourseInfo: (
    courseUrl: string,
    updatedInfo: Partial<CourseInfo>
  ) => Promise<void>;
  addNewCourseInfo: (courseUrl: string, info: CourseInfo) => void;
  deleteCourse: (courseUrl: string) => Promise<void>;
  getCourseInfoToCards: (page: number, params: FetchCourseInfoParams, newFilters: boolean, savedCourses: string[]) => Promise<void>;
  getCourseInfoToDetail: (courseUrl: string) => Promise<CourseDetail | null>;
  changeMaterialCount: (courseUrl: string, pageLength: number) => void;
  publishCourse: (courseUrl: string) => Promise<void>;
  clearStore: () => void;
}
export interface CourseCard {
  title: string;
  description: string;
  url: string;
  img: string;
}

export interface CourseDetail {
  title: string;
  description?: string;
  owner_name: string;
  img?: string;
  type?: string;
  material_count: number;
  created_at: Date | null;
}



export interface savedCourseState {
  savedCourses: string[];
  isLoading: boolean;
  isInSavedCourse: (id: string) => boolean;
  addToSavedCourses: (id: string) => Promise<void>;
  removeFromSavedCourse: (id: string) => Promise<void>;
  fetchsavedCourses: () => Promise<string[]>;

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
  user_avatar: string;
  user_name: string;
  comment: string;
  created_at: string;
  review_rating: number;
}
export interface LocalCommentsState {
  average_rating: number;
  comments: CourseComments[];
}
export interface CourseCommentsStore {
  comments: {
    [url: string]: { average_rating: number; comment: CourseComments[] };
  };
  isLoading: boolean;
  fetchComments: (courseUrl: string) => Promise<LocalCommentsState | void>;
  addComment: (courseUrl: string, comment: string, rating: number) => Promise<void>;
  clearStore: () => void;
}
