import axios from "axios";
import { BACKEND_URL } from "../../variables";
import { create } from "zustand";
import type { CourseDetail, CourseDetailState } from "../Storetypes";

export const useCourseDetailStore = create<CourseDetailState>((set, get) => ({
  coursesDetail: {},
  currentCourseDetail: null,
  isLoading: false,
  setCoursesDetail: (url, courseDetail) => {
    set({ coursesDetail: { ...get().coursesDetail, [url]: courseDetail } });
  },
  setCurrentCourseDetail: (url, courseDetail) => {
    const coursesDetail = { ...get().coursesDetail };
    if (!coursesDetail[url]) {
      coursesDetail[url] = courseDetail;
      set({ coursesDetail: coursesDetail, currentCourseDetail: courseDetail });
      return;
    }
    delete coursesDetail[url];
    coursesDetail[url] = courseDetail;
    set({ currentCourseDetail: courseDetail, coursesDetail: coursesDetail });
  },
  replaceFirstCourseDetailWithNewCourseDetail: (newUrl, newCourseDetail) => {
    const updatedDetails = { ...get().coursesDetail };
    const firstKey = Object.keys(updatedDetails)[0];

    delete updatedDetails[firstKey];

    updatedDetails[newUrl] = newCourseDetail;

    set({ coursesDetail: updatedDetails });
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
      Object.keys(get().coursesDetail).length < 150
        ? set({ coursesDetail: { ...get().coursesDetail, [url]: data } })
        : get().replaceFirstCourseDetailWithNewCourseDetail(url, data);
      set({
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
