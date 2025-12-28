import axios from "axios";
import { BACKEND_URL } from "../variables";
import { create } from "zustand";
import type { CourseDetail, CourseDetailState } from "./Storetypes";

export const useCourseDetailStore = create<CourseDetailState>((set, get) => ({
  coursesDetail: {},
  currentCourseDetail: {
    name: "",
    material_count: 0,
    owner: "",
    reviews_count: 0,
    average_rating: 0,
  },
  isLoading: false,
  error: null,
  setCoursesDetail: (url, courseDetail) => {
    set({ coursesDetail: { ...get().coursesDetail, [url]: courseDetail } });
  },
  setCourseDetail: (courseDetail) => {
    set({ currentCourseDetail: courseDetail });
  },

  fetchCoursesDetail: async (url) => {
    if (!url) return null;
    if (get().coursesDetail[url]) {
      return get().coursesDetail[url];
    }
    set({ isLoading: true, error: null });
    try {
      console.log("fetching course detail from backend...");
      const response = await axios.get(`${BACKEND_URL}/courses/${url}`, {
        withCredentials: true,
      });
      if (!response) throw new Error("Błąd pobierania");

      const data: CourseDetail = response.data.course;
      set({
        coursesDetail: { ...get().coursesDetail, [url]: data },
        isLoading: false,
        currentCourseDetail: data,
      });
      return data;
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
      return null;
    }
  },
  clearStore: () => set({ coursesDetail: {} }),
}));
