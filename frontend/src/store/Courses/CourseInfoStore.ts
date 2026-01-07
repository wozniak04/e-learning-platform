import axios from "axios";
import { BACKEND_URL } from "../../variables";
import { create } from "zustand";
import type { CourseInfo, CourseInfoStore } from "../Storetypes";
const MAX_COURSE_INFO_STORE = 150;

const replaceFirstCourseInfoWithNewCourseInfo = (
  Courses: { [url: string]: CourseInfo },
  newUrl: string,
  newCourseInfo: CourseInfo
): { [url: string]: CourseInfo } => {
  const firstKey = Object.keys(Courses)[0];
  const updatedInfo = { ...Courses };
  delete updatedInfo[firstKey];
  updatedInfo[newUrl] = newCourseInfo;
  return updatedInfo;
};
const replaceFirst20InfoWithNewCoursesInfo = (
  Courses: { [url: string]: CourseInfo },
  newCoursesInfo: { [url: string]: CourseInfo }
): { [url: string]: CourseInfo } => {
  const firstKeys = Object.keys(Courses).slice(0, 20);
  firstKeys.forEach((key) => delete Courses[key]);
  const updatedCoursesInfo = { ...Courses, ...newCoursesInfo };
  return updatedCoursesInfo;
};

export const useCoursesInfoStore = create<CourseInfoStore>((set, get) => ({
  coursesInfo: {},
  isLoading: false,
  fetchCourseInfoByUrl: async (courseUrl) => {
    if (get().coursesInfo[courseUrl]) {
      return get().coursesInfo[courseUrl];
    }
    set({ isLoading: true });
    try {
      const response = await axios.get(`${BACKEND_URL}/courses/${courseUrl}`);
      const courseInfo = response.data;
      if (Object.keys(get().coursesInfo).length < MAX_COURSE_INFO_STORE) {
        set({
          coursesInfo: { ...get().coursesInfo, [courseUrl]: courseInfo },
        });
      } else {
        const updatedCoursesInfo = replaceFirstCourseInfoWithNewCourseInfo(
          get().coursesInfo,
          courseUrl,
          courseInfo
        );
        set({
          coursesInfo: updatedCoursesInfo,
        });
      }
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      console.error("Error fetching course info:", error);
      set({ isLoading: false });
      return null;
    }
  },
  fetchCoursesInfo: async (page) => {
    set({ isLoading: true });
    try {
      const response = await axios.get(`${BACKEND_URL}/courses?page=${page}`);
      const coursesInfo = response.data.courses;
      if (Object.keys(get().coursesInfo).length < MAX_COURSE_INFO_STORE) {
        set({
          coursesInfo: { ...get().coursesInfo, ...coursesInfo },
        });
        set({ isLoading: false });
      } else {
        const updatedCoursesInfo = replaceFirst20InfoWithNewCoursesInfo(
          get().coursesInfo,
          coursesInfo
        );
        set({
          coursesInfo: updatedCoursesInfo,
        });
        set({ isLoading: false });
      }
    } catch (error) {
      console.error("Error fetching courses info:", error);
      set({ isLoading: false });
    }
  },
  updateCourseInfo: (courseUrl, updatedInfo) => {
    const currentCourseInfo = get().coursesInfo[courseUrl];
    if (currentCourseInfo) {
      set({
        coursesInfo: {
          ...get().coursesInfo,
          [courseUrl]: { ...currentCourseInfo, ...updatedInfo },
        },
      });
    }
  },
  getCourseInfoToCards: async (page: number) => {
    const coursesPerPage = 20;
    const startIndex = (page - 1) * coursesPerPage;
    const endIndex = startIndex + coursesPerPage;

    let currentEntries = Object.entries(get().coursesInfo);

    if (startIndex >= currentEntries.length) {
      await get().fetchCoursesInfo(page);
      currentEntries = Object.entries(get().coursesInfo);
    }

    return currentEntries
      .slice(startIndex, endIndex)
      .map(([url, info]: [string, CourseInfo]) => ({
        title: info.title,
        description: info.quick_description,
        url: url,
        imgsrc: info.imgsrc || "default-placeholder.png",
      }));
  },
  getCourseInfoToDetail: async (courseUrl) => {
    const courseInfo = await get().fetchCourseInfoByUrl(courseUrl);
    if (!courseInfo) {
      return null;
    }
    return {
      title: courseInfo.title,
      description: courseInfo.description,
      owner_name: courseInfo.owner_name,
      imgsrc: courseInfo.imgsrc || "default-placeholder.png",
      type: courseInfo.type || "default",
    };
  },
  clearStore: () => {
    set({ coursesInfo: {}, isLoading: false });
  },
}));
