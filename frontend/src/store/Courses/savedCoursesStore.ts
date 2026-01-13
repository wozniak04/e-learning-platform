import axios from "axios";
import { BACKEND_URL } from "../../variables";
import { create } from "zustand";
import type { savedCourseState } from "../Storetypes";

export const useSavedCoursesStore = create<savedCourseState>((set, get) => ({
  savedCourses: [],
  isLoading: false,
  addToSavedCourses: async (id: string) => {
    const courses = get().savedCourses;
    if (courses.length >= 5)
      throw new Error("you can sing up to only 5 courses");
    if (courses.some((course) => course === id))
      throw new Error("you are already signed up to this course");

    try {
      await axios.post(
        `${BACKEND_URL}/courses/${id}/sign`,
        {},
        {
          withCredentials: true,
        }
      );
      set({ savedCourses: [...get().savedCourses, id] });
      console.log("kursy ulubione: ", get().savedCourses);
    } catch (error) {
      throw new Error(error as string);
    }
  },
  removeFromSavedCourse: async (id: string) => {
    try {
      await axios.delete(`${BACKEND_URL}/courses/${id}/unsign`, {
        withCredentials: true,
      });
      set({
        savedCourses: get().savedCourses.filter((course) => course !== id),
      });
      console.log("kursy ulubione: ", get().savedCourses);
    } catch (error) {
      throw new Error(error as string);
    }
  },

  isInSavedCourse: (id) => {
    return get().savedCourses.some((course) => course === id);
  },

  fetchsavedCourses: async () => {
    if (get().savedCourses.length > 0) return get().savedCourses;

    try {
      set({ isLoading: true });
      const result = await axios.get(`${BACKEND_URL}/courses/saved`, {
        withCredentials: true,
      });
      if (!result) throw new Error("Error while fetching");
      const urls = result.data.savedCourses.map((x: any) => x.url)
      set({ savedCourses: urls });
      set({ isLoading: false });
      return urls;
    } catch (error) {
      set({ isLoading: false });
      throw new Error(error as string);
    }
  },
  clearStore: () => {
    set({ savedCourses: [] });
  },
}));
