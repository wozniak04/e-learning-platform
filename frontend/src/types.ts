export interface Course {
  name: string;
  description: string;
  url: string;
  imgsrc?: string;
}
export interface CourseState {
  courses: Course[];
  isLoading: boolean;
  error: string | null;

  setCourses: (courses: Course[]) => void;
  fetchCourses: () => Promise<void>;
  clearStore: () => void;
}
