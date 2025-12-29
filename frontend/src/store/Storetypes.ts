export interface Course {
  name: string;
  description: string;
  url: string;
  imgsrc: string;
}
export interface CourseState {
  courses: Course[];
  isLoading: boolean;
  error: string | null;

  setCourses: (courses: Course[]) => void;
  fetchCourses: () => Promise<void>;
  clearStore: () => void;
}

export interface CourseDetail {
  name: string;
  description?: string;
  material_count: number;
  owner: string;
  imgsrc?: string;
  type?: string;
  reviews_count: number;
  average_rating: number;
}
export interface CourseDetailState {
  currentCourseDetail: CourseDetail;
  coursesDetail: { [url: string]: CourseDetail };
  isLoading: boolean;
  error: string | null;
  setCoursesDetail: (url: string, courseDetail: CourseDetail) => void;
  fetchCoursesDetail: (url: string | undefined) => Promise<undefined>;
  clearStore: () => void;
}

export interface savedCourseState {
  savedCourses: string[];
  isLoading: boolean;
  error: string | null;
  setsavedCourses: (id: string) => void;
  fetchsavedCourses: () => Promise<void>;

  clearStore: () => void;
}
