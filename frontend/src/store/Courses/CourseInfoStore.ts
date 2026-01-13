import axios from "axios";
import { BACKEND_URL } from "../../variables";
import { create } from "zustand";
import type { CourseInfo, CourseInfoStore, FetchCourseInfoParams, CourseCard } from "../Storetypes";
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

const filterCourses = (
  Courses: { [url: string]: CourseInfo },
  filters: FetchCourseInfoParams = {},
  savedCoursesUrls: string[] = []
): CourseCard[] => {

  const entries = Object.entries(Courses).map(([url, info]) => ({
    title: info.title,
    description: info.quick_description,
    url: url,
    imgsrc: info.imgsrc || "default-placeholder.png",
    _type: info.type,
    _created_at: info.created_at,
  }));


  const filtered = entries.filter((course) => {

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const matchesSearch =
        course.title.toLowerCase().includes(searchTerm) ||
        course.description.toLowerCase().includes(searchTerm);
      if (!matchesSearch) return false;
    }


    if (filters.type && filters.type !== 'all') {
      if (course._type !== filters.type) return false;
    }


    if (filters.onlysaved) {
      if (!savedCoursesUrls.includes(course.url)) return false;
    }

    return true;
  });


  if (filters.sort) {
    filtered.sort((a, b) => {
      switch (filters.sort) {
        case 'newest': {
          const timeA = a._created_at ? new Date(a._created_at).getTime() : 0;
          const timeB = b._created_at ? new Date(b._created_at).getTime() : 0;
          return timeB - timeA;
        }
        case 'oldest': {
          const timeA = a._created_at ? new Date(a._created_at).getTime() : 0;
          const timeB = b._created_at ? new Date(b._created_at).getTime() : 0;
          return timeA - timeB;
        }
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });
  }

  return filtered.map(({ title, description, url, imgsrc }) => ({
    title,
    description,
    url,
    imgsrc,
  }));
};
export const useCoursesInfoStore = create<CourseInfoStore>((set, get) => ({
  coursesInfo: {},
  totalCount: 0,
  isLoading: false,
  fetchCourseInfoByUrl: async (courseUrl) => {
    if (get().coursesInfo[courseUrl]) {
      return get().coursesInfo[courseUrl];
    }
    set({ isLoading: true });
    try {
      const response = await axios.get(`${BACKEND_URL}/courses/${courseUrl}`);
      const courseInfoFromApi = response.data.course;
      if (Object.keys(get().coursesInfo).length < MAX_COURSE_INFO_STORE) {
        if (Object.keys(get().coursesInfo).length === 0) {
          set({ coursesInfo: { ...courseInfoFromApi }, totalCount: 1 })
        } else {
          set({
            coursesInfo: { ...get().coursesInfo, ...courseInfoFromApi }, totalCount: get().totalCount + 1
          });
        }
      } else {
        const updatedCoursesInfo = replaceFirstCourseInfoWithNewCourseInfo(
          get().coursesInfo,
          courseUrl,
          courseInfoFromApi
        );
        set({
          coursesInfo: updatedCoursesInfo,
        });
      }
      set({ isLoading: false });
      return response.data.course[Object.keys(response.data.course)[0]];
    } catch (error) {
      console.error("Error fetching course info:", error);
      set({ isLoading: false });
      return null;
    }
  },
  fetchCoursesInfo: async (page, params) => {
    set({ isLoading: true });
    try {
      const limit = 6;

      const offset = (page - 1) * limit;

      const response = await axios.get(`${BACKEND_URL}/courses`, {
        params: {
          search: params.search,
          type: params.type,
          sort: params.sort,
          onlySaved: params.onlysaved,
          limit: limit,
          offset: offset
        }
      });
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
      set({ isLoading: false });
      throw error;
    }
  },
  updateCourseInfo: async (courseUrl, updatedInfo) => {
    const currentCourseInfo = get().coursesInfo[courseUrl];
    set({ isLoading: true });
    try {
      await axios.put(`${BACKEND_URL}/courses/${courseUrl}/edit`, updatedInfo, {
        withCredentials: true,
      });
      set({
        coursesInfo: {
          ...get().coursesInfo,
          [courseUrl]: { ...currentCourseInfo, ...updatedInfo },
        },
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  addNewCourseInfo: (courseUrl, info) => {
    if (Object.keys(get().coursesInfo).length < MAX_COURSE_INFO_STORE) {
      set({
        coursesInfo: { ...get().coursesInfo, [courseUrl]: info },
      });
    }
    const updatedCoursesInfo = replaceFirstCourseInfoWithNewCourseInfo(
      get().coursesInfo,
      courseUrl,
      info
    );
    set({
      coursesInfo: updatedCoursesInfo,
    });
  },
  deleteCourse: async (url) => {
    set({ isLoading: true });
    try {
      await axios.delete(`${BACKEND_URL}/courses/${url}`, {
        withCredentials: true,
      });
      if (Object.keys(get().coursesInfo).length <= 1) {
        set({ coursesInfo: {}, isLoading: false });
        return;
      }
      const { [url]: _, ...remainingCourses } = get().coursesInfo;

      set({
        coursesInfo: remainingCourses,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      console.error("Error deleting course", error);
      throw error;
    }
  },
  getCourseInfoToCards: async (page, params, filtresChanged, savedCourses) => {
    const coursesPerPage = 6;
    const startIndex = (page - 1) * coursesPerPage;
    const endIndex = startIndex + coursesPerPage;

    if (filtresChanged) {
      await get().fetchCoursesInfo(page, params)
    }

    let currentEntries = filterCourses(get().coursesInfo, params, savedCourses);
    if (startIndex >= currentEntries.length - 1 && !filtresChanged) {
      await get().fetchCoursesInfo(page, params);
      currentEntries = filterCourses(get().coursesInfo, params, savedCourses);
    }
    return currentEntries
      .slice(startIndex, endIndex)

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
      material_count: courseInfo.material_count,
      created_at: courseInfo.created_at
        ? new Date(courseInfo.created_at)
        : null,
    };
  },
  changeMaterialCount: (url, pageLength) => {
    set({
      coursesInfo: {
        ...get().coursesInfo,
        [url]: {
          ...get().coursesInfo[url],
          material_count: pageLength,
        },
      },
    });
  },
  publishCourse: async (url) => {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/courses/${url}/publish`,
        {},
        { withCredentials: true }
      );

      set({
        coursesInfo: {
          ...get().coursesInfo,
          [url]: {
            ...get().coursesInfo[url],
            created_at: response.data.created_at,
          },
        },
      });
    } catch (error) {
      console.error("Błąd podczas publikowania: ", error);
      throw Error("Błąd podczas publikowania");
    }
  },
  clearStore: () => {
    set({ coursesInfo: {}, isLoading: false });
  },
}));
