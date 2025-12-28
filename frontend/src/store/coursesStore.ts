import axios from "axios";
import { BACKEND_URL } from "../variables";
import { create } from "zustand";
import type { Course, CourseState } from "./Storetypes";

export const useCourseStore = create<CourseState>((set, get) => ({
  courses: [],
  isLoading: false,
  error: null,

  setCourses: (courses) => set({ courses }),

  fetchCourses: async () => {
    if (get().courses.length > 0) {
      return;
    }

    set({ isLoading: true, error: null });

    try {
      console.log("fetching courses from backend...");
      const response = await axios.get(`${BACKEND_URL}/courses`, {
        withCredentials: true,
      });
      if (!response) throw new Error("Błąd pobierania");

      const data: Course[] = response.data.courses;
      set({ courses: data, isLoading: false });
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
    }
  },

  clearStore: () => set({ courses: [] }),
}));
