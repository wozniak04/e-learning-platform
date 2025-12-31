export interface Course {
  name: string;
  description: string;
  url: string;
  imgsrc: string;
}
export interface CourseState {
  courses: Course[];
  isLoading: boolean;

  setCourses: (courses: Course[]) => void;
  fetchCourses: () => Promise<void>;
  clearStore: () => void;
}

export interface CourseDetail {
  name: string;
  description?: string;
  material_count: number;
  owner_name: string;
  imgsrc?: string;
  type?: string;
  reviews_count: number;
  average_rating: number;
}
export interface CourseDetailState {
  currentCourseDetail: CourseDetail | null;
  coursesDetail: { [url: string]: CourseDetail };
  isLoading: boolean;
  setCoursesDetail: (url: string, courseDetail: CourseDetail) => void;
  fetchCoursesDetail: (url: string | undefined) => Promise<undefined>;
  clearStore: () => void;
}

export interface savedCourseState {
  savedCourses: string[];
  isLoading: boolean;
  isInSavedCourse: (id: string) => boolean;
  addToSavedCourses: (id: string) => Promise<void>;
  removeFromSavedCourse: (id: string) => Promise<void>;
  fetchsavedCourses: () => Promise<void>;

  clearStore: () => void;
}
