export interface CourseInfo {
  title: string;
  description?: string;
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
export interface CourseDetailState {
  currentCourseDetail: CourseDetail | null;
  coursesDetail: { [url: string]: CourseDetail };
  isLoading: boolean;
  setCoursesDetail: (url: string, courseDetail: CourseDetail) => void;
  setCurrentCourseDetail: (url: string, courseDetail: CourseDetail) => void;
  replaceFirstCourseDetailWithNewCourseDetail: (
    newUrl: string,
    newCourseDetail: CourseDetail
  ) => void;
  fetchCoursesDetail: (url: string | undefined) => Promise<undefined>;
  clearStore: () => void;
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

export interface Course_info {
  title: string;
  description: string;
  quick_description: string;
  type: string | null;
  img: File | null;
  password: string | null;
}

export interface CourseMaterial {
  id: number;
  title: string;
  content: string;
  page: number;
}
export interface CourseMaterialState {
  courseMaterials: { [url: string]: CourseMaterial[] };
  isLoading: boolean;
  setCourseMaterials: (url: string, materials: CourseMaterial[]) => void;
  fetchCourseMaterials: (courseUrl: string) => Promise<CourseMaterial[] | void>;
  replaceFirstCourseMaterialWithNew: (
    newUrl: string,
    newCourseMaterial: CourseMaterial[]
  ) => void;
  clearStore: () => void;
}
