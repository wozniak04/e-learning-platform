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

  fetchCoursesDetail: async (url) => {
    if (!url) {
      set({ error: "no url provided" });
      return;
    }
    if (get().coursesDetail[url]) {
      set({ currentCourseDetail: get().coursesDetail[url] });
      return;
    }
    set({ isLoading: true, error: null });
    try {
      console.log("fetching course detail from backend...");
      const response = await axios.get(`${BACKEND_URL}/courses/${url}`, {
        withCredentials: true,
      });
      if (!response) {
        set({ error: "error in response" });
      }

      const data: CourseDetail = response.data.course;
      set({
        coursesDetail: { ...get().coursesDetail, [url]: data },
        isLoading: false,
        currentCourseDetail: data,
      });
      return;
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
      return;
    }
  },
  clearStore: () => set({ coursesDetail: {}, isLoading: false, error: null }),
}));
