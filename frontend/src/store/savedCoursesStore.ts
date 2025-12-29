import axios from "axios";
import { BACKEND_URL } from "../variables";
import { create } from "zustand";
import type { savedCourseState } from "./Storetypes";

export const useSavedCoursesStore = create<savedCourseState>((set, get) => ({
  savedCourses: [],
  isLoading: false,
  error: null,
  setsavedCourses: (id: string) => {
    set({ savedCourses: [...get().savedCourses, id] });
  },
  fetchsavedCourses: async () => {
    if (get().savedCourses.length > 0) return;
    set({ isLoading: true, error: null });
    try {
      const result = await axios.get(`${BACKEND_URL}/courses/saved`);
      if (!result) throw new Error("Error while fetching");
      set({ savedCourses: result.data, isLoading: false, error: null });
    } catch (err) {
      set({ isLoading: false, error: err as string });
    }
  },
  clearStore: () => {
    set({ isLoading: false, error: null, savedCourses: [] });
  },
}));
