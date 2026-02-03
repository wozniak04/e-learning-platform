import axios from "axios";
import { BACKEND_URL, COURSES_PER_PAGE } from "../../variables";
import { create } from "zustand";
import type { CourseInfo, CourseInfoStore, FetchCourseInfoParams, CourseCard } from "../Storetypes";
import { getCsrfToken, getCsrfHeaders } from "../../Api/csrfHelper";
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
    img: info.img || "",
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

  return filtered.map(({ title, description, url, img }) => ({
    title,
    description,
    url,
    img,
  }));
};
export const useCoursesInfoStore = create<CourseInfoStore>((set, get) => ({
  coursesInfo: {},
  coursesCard: [],
  totalCount: 0,
  totalPages: 0,
  isLoading: false,
  fetchCourseInfoByUrl: async (courseUrl) => {
    if (get().coursesInfo[courseUrl]) {
      return get().coursesInfo[courseUrl];
    }
    set({ isLoading: true });
    try {
      const response = await axios.get(`${BACKEND_URL}/courses/${courseUrl}`);
      const courseInfoFromApi = response.data.course;
      console.log(courseInfoFromApi)
      if (Object.keys(get().coursesInfo).length < MAX_COURSE_INFO_STORE) {
        if (Object.keys(get().coursesInfo).length === 0) {
          set({ coursesInfo: { ...courseInfoFromApi }, totalCount: 1, totalPages: 1 })
        } else {
          set({
            coursesInfo: { ...get().coursesInfo, ...courseInfoFromApi }, totalCount: get().totalCount + 1, totalPages: Math.ceil((get().totalCount + 1) / COURSES_PER_PAGE)
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
      const limit = COURSES_PER_PAGE;
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
      const total_Count = response.data.totalCount
      console.log(coursesInfo)
      set({ totalCount: total_Count })
      if (Object.keys(get().coursesInfo).length < MAX_COURSE_INFO_STORE) {
        set({
          coursesInfo: { ...get().coursesInfo, ...coursesInfo }, isLoading: false, totalCount: total_Count, totalPages: Math.ceil(total_Count / COURSES_PER_PAGE)
        });

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
      set({ isLoading: false });
      return coursesInfo
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  updateCourseInfo: async (courseUrl, updatedInfo) => {
    const currentCourseInfo = get().coursesInfo[courseUrl];
    set({ isLoading: true });
    try {
      const csrfToken = await getCsrfToken();
      await axios.put(`${BACKEND_URL}/courses/${courseUrl}/edit`, updatedInfo, {
        withCredentials: true,
        headers: getCsrfHeaders(csrfToken),
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
        coursesInfo: { ...get().coursesInfo, [courseUrl]: info }, totalCount: get().totalCount + 1, totalPages: Math.ceil(get().totalCount / COURSES_PER_PAGE)
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
      const csrfToken = await getCsrfToken();
      await axios.delete(`${BACKEND_URL}/courses/${url}`, {
        withCredentials: true,
        headers: getCsrfHeaders(csrfToken),
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
    const startIndex = (page - 1) * COURSES_PER_PAGE;
    const endIndex = startIndex + COURSES_PER_PAGE;
    if (!filtresChanged && startIndex > Object.keys(get().coursesInfo).length) {
      const result = await get().fetchCoursesInfo(page, params)
      const filter = filterCourses(result!, params, savedCourses)
      set({ coursesCard: filter })
      return;
    }
    let currentEntries = filterCourses(get().coursesInfo, params, savedCourses);
    set({ totalCount: currentEntries.length, totalPages: Math.ceil((currentEntries.length) / COURSES_PER_PAGE) })
    if (currentEntries.length < COURSES_PER_PAGE && filtresChanged) {
      await get().fetchCoursesInfo(page, params);
      currentEntries = filterCourses(get().coursesInfo, params, savedCourses);
      set({ coursesCard: currentEntries })
    }
    if (startIndex >= currentEntries.length - 1) {
      await get().fetchCoursesInfo(page, params);
      currentEntries = filterCourses(get().coursesInfo, params, savedCourses);
    }
    set({ coursesCard: currentEntries.slice(startIndex, endIndex) })

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
      img: courseInfo.img,
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
      const csrfToken = await getCsrfToken();
      const response = await axios.post(
        `${BACKEND_URL}/courses/${url}/publish`,
        {},
        {
          withCredentials: true,
          headers: getCsrfHeaders(csrfToken),
        }
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
