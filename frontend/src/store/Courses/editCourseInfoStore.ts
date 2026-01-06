import axios from "axios";
import { BACKEND_URL } from "../../variables";
import { create } from "zustand";
import type { Edit_CourseInfo_State } from "../Storetypes";
export const useEditCourseInfoStore = create<Edit_CourseInfo_State>(
  (set, get) => ({
    currentCourse: null,
    CoursesInfo: {},
    isLoading: false,
    setCurrentCourseInfo: (courseInfo) => {
      set({ currentCourse: courseInfo });
    },
    fetchCourseInfo: async (courseUrl) => {
      if (get().CoursesInfo[courseUrl]) {
        set({ currentCourse: get().CoursesInfo[courseUrl] });
        return;
      }
      try {
        set({ isLoading: true });
        const response = await axios.get(
          `${BACKEND_URL}/courses/${courseUrl}/info`
        );
        set({
          currentCourse: response.data.courseInfo,
          CoursesInfo: {
            ...get().CoursesInfo,
            [courseUrl]: response.data.courseInfo,
          },
        });
        set({ isLoading: false });
      } catch (error) {
        console.error("Error fetching course info:", error);
      } finally {
        set({ isLoading: false });
      }
    },
    updateCourseInfo: async (courseUrl, updatedInfo) => {
      try {
        const response = await axios.put(
          `${BACKEND_URL}/courses/${courseUrl}/info`,
          updatedInfo
        );
        set({ currentCourse: response.data.courseInfo });
      } catch (error) {
        console.error("Error updating course info:", error);
      }
    },
    clearStore: () => {
      set({
        currentCourse: null,
        CoursesInfo: {},
        isLoading: false,
      });
    },
  })
);
