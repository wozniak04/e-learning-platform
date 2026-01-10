import axios from "axios";
import { BACKEND_URL } from "../../variables";
import { create } from "zustand";
import type { CourseMaterialState, CourseMaterial } from "../Storetypes";
import { useCoursesInfoStore } from "./CourseInfoStore";

const replaceFirstCourseMaterialWithNew = (
  CourseMaterials: { [url: string]: CourseMaterial[] },
  newUrl: string,
  newCourseMaterial: CourseMaterial[]
): { [url: string]: CourseMaterial[] } => {
  const firstKey = Object.keys(CourseMaterials)[0];

  delete CourseMaterials[firstKey];

  CourseMaterials[newUrl] = newCourseMaterial;
  return CourseMaterials;
};
export const useCourseMaterialStore = create<CourseMaterialState>(
  (set, get) => ({
    courseMaterials: {},
    isLoading: false,
    setCourseMaterials: async (url, materials) => {
      const allFieldsFilled = materials.every(
        (m) => m.title.trim() !== "" && m.content.trim() !== ""
      );
      if (!allFieldsFilled) {
        throw new Error("Wszystkie tytuły i treści muszą być uzupełnione");
      }

      try {
        const isExisting =
          get().courseMaterials[url] && get().courseMaterials[url].length > 0;
        const endpoint = isExisting
          ? `${BACKEND_URL}/courses/${url}/material/edit`
          : `${BACKEND_URL}/courses/${url}/material`;

        await axios({
          method: isExisting ? "put" : "post",
          url: endpoint,
          data: { materials },
          withCredentials: true,
        });

        set({
          courseMaterials: { ...get().courseMaterials, [url]: materials },
        });

        useCoursesInfoStore
          .getState()
          .changeMaterialCount(url, materials.length);
      } catch (error) {
        throw new Error("Error in setting course materials:", { cause: error });
      }
    },

    fetchCourseMaterials: async (courseUrl) => {
      if (get().courseMaterials[courseUrl]) {
        return get().courseMaterials[courseUrl];
      }
      try {
        set({ isLoading: true });
        const response = await axios.get(
          `${BACKEND_URL}/courses/${courseUrl}/material`,
          { withCredentials: true }
        );
        if (Object.keys(get().courseMaterials).length < 10) {
          set({
            courseMaterials: {
              ...get().courseMaterials,
              [courseUrl]: response.data.courseMaterial,
            },
          });
        } else {
          set({
            courseMaterials: replaceFirstCourseMaterialWithNew(
              get().courseMaterials,
              courseUrl,
              response.data.courseMaterial
            ),
          });
        }
        set({ isLoading: false });
        return response.data.courseMaterial;
      } catch (error) {
        console.error("Error fetching course materials:", error);
      } finally {
        set({ isLoading: false });
      }
    },

    clearStore: () => {
      set({ courseMaterials: {}, isLoading: false });
    },
  })
);
