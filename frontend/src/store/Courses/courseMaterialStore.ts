import axios from "axios";
import { BACKEND_URL } from "../../variables";
import { create } from "zustand";
import type { CourseMaterialState, CourseMaterial } from "../Storetypes";
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
      console.log(get().courseMaterials);
      try {
        if (get().courseMaterials[url].length > 0) {
          console.log(materials);
          await axios.put(
            `${BACKEND_URL}/courses/${url}/material/edit`,
            { materials: materials },
            {
              withCredentials: true,
            }
          );
        } else {
          await axios.post(
            `${BACKEND_URL}/courses/${url}/material`,
            { materials: materials },
            {
              withCredentials: true,
            }
          );
        }

        set({
          courseMaterials: { ...get().courseMaterials, [url]: materials },
        });
      } catch (error) {
        throw new Error("Error setting course materials:", { cause: error });
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
        console.log(response.data);
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
