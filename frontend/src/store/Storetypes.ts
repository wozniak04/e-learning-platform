export interface Course {
  name: string;
  description: string;
  url: string;
  imgsrc: string;
}
export interface CourseCardState {
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

export interface Create_new_Course_State {
  isCreating: boolean;
  isCreated: boolean;
  title: string;
  description: string;
  quick_description: string;
  type: string;
  img: File | null;
  password: string | null;
  updatetitle: (title: string) => void;
  updatedescription: (description: string) => void;
  updatequick_description: (quick_description: string) => void;
  updatetype: (type: string) => void;
  updateimg: (img: File | null) => void;
  updatepassword: (password: string | null) => void;
  createNewCourse: () => Promise<void | string>;
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
export interface Edit_CourseInfo_State {
  currentCourse: Course_info | null;
  CoursesInfo: { [url: string]: Course_info };
  isLoading: boolean;
  setCurrentCourseInfo: (courseInfo: Course_info) => void;
  fetchCourseInfo: (courseUrl: string) => Promise<void>;
  updateCourseInfo: (
    courseUrl: string,
    updatedInfo: Partial<Course_info>
  ) => void;
  clearStore: () => void;
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
