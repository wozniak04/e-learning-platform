import axios from "axios";
import { BACKEND_URL } from "../variables";
import { create } from "zustand";
import type { CourseDetail, CourseDetailState } from "./Storetypes";

export const useCourseDetailStore = create<CourseDetailState>((set, get) => ({
  coursesDetail: {},
  currentCourseDetail: null,
  isLoading: false,
  setCoursesDetail: (url, courseDetail) => {
    set({ coursesDetail: { ...get().coursesDetail, [url]: courseDetail } });
  },

  fetchCoursesDetail: async (url) => {
    if (!url) {
      throw new Error("no url provided");
    }
    if (get().coursesDetail[url]) {
      set({ currentCourseDetail: get().coursesDetail[url] });
      return;
    }
    set({ isLoading: true });
    try {
      console.log("fetching course detail from backend...");
      const response = await axios.get(`${BACKEND_URL}/courses/${url}`, {
        withCredentials: true,
      });
      if (!response) {
        throw new Error("error in response");
      }
      const data: CourseDetail = response.data.course;
      set({
        coursesDetail: { ...get().coursesDetail, [url]: data },
        isLoading: false,
        currentCourseDetail: data,
      });
      return;
    } catch (error) {
      set({ isLoading: false });
      throw new Error(error as string);
    }
  },
  clearStore: () => set({ coursesDetail: {}, isLoading: false }),
}));
