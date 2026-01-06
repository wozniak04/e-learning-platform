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
    if (courses.some((course) => course.url === id))
      throw new Error("you are already signed up to this course");

    try {
      await axios.post(
        `${BACKEND_URL}/courses/${id}/sign`,
        {},
        {
          withCredentials: true,
        }
      );
      set({ savedCourses: [...get().savedCourses, { url: id, page: 1 }] });
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
        savedCourses: get().savedCourses.filter((course) => course.url !== id),
      });
      console.log("kursy ulubione: ", get().savedCourses);
    } catch (error) {
      throw new Error(error as string);
    }
  },

  isInSavedCourse: (id) => {
    return get().savedCourses.some((course) => course.url === id);
  },
  getPageOfSavedCourse: (id: string) => {
    const course = get().savedCourses.find((course) => course.url === id);
    return course ? course.page : null;
  },
  fetchsavedCourses: async () => {
    if (get().savedCourses.length > 0) return get().savedCourses;

    try {
      set({ isLoading: true });
      const result = await axios.get(`${BACKEND_URL}/courses/saved`, {
        withCredentials: true,
      });
      if (!result) throw new Error("Error while fetching");
      console.log("fetched saved courses: ", result.data.savedCourses);
      set({ savedCourses: result.data.savedCourses });
      set({ isLoading: false });
      return result.data.savedCourses;
    } catch (error) {
      set({ isLoading: false });
      throw new Error(error as string);
    }
  },
  clearStore: () => {
    set({ savedCourses: [] });
  },
}));
