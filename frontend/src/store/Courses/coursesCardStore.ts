import axios from "axios";
import { BACKEND_URL } from "../../variables";
import { create } from "zustand";
import type { Course, CourseCardState } from "../Storetypes";

export const useCoursesCardStore = create<CourseCardState>((set, get) => ({
  courses: [],
  isLoading: false,

  setCourses: (courses) => set({ courses }),

  fetchCourses: async () => {
    if (get().courses.length > 0) {
      return;
    }

    set({ isLoading: true });

    try {
      console.log("fetching courses from backend...");
      const response = await axios.get(`${BACKEND_URL}/courses`, {
        withCredentials: true,
      });
      if (!response) throw new Error("Error while fetching");

      const data: Course[] = response.data.courses;
      set({ courses: data, isLoading: false });
    } catch (err) {
      set({ isLoading: false });
      throw new Error(err as string);
    }
  },

  clearStore: () => set({ courses: [], isLoading: false }),
}));
