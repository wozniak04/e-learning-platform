import axios from "axios";
import { BACKEND_URL } from "../../variables";
import { create } from "zustand";
import type { CourseMaterialState } from "../Storetypes";
export const useCourseMaterialStore = create<CourseMaterialState>(
  (set, get) => ({
    courseMaterials: {},
    isLoading: false,
    setCourseMaterials: (url, materials) => {
      set({ courseMaterials: { ...get().courseMaterials, [url]: materials } });
    },
    fetchCourseMaterials: async (courseUrl) => {
      if (get().courseMaterials[courseUrl]) {
        return get().courseMaterials[courseUrl];
      }
      try {
        set({ isLoading: true });
        const response = await axios.get(
          `${BACKEND_URL}/courses/${courseUrl}/materials`
        );
        if (Object.keys(get().courseMaterials).length < 10) {
          get().setCourseMaterials(courseUrl, response.data.materials);
        } else {
          get().replaceFirstCourseMaterialWithNew(
            courseUrl,
            response.data.materials
          );
        }
        set({ isLoading: false });
        return response.data.materials;
      } catch (error) {
        console.error("Error fetching course materials:", error);
      } finally {
        set({ isLoading: false });
      }
    },
    replaceFirstCourseMaterialWithNew: (newUrl, newCourseMaterial) => {
      const updatedMaterials = { ...get().courseMaterials };
      const firstKey = Object.keys(updatedMaterials)[0];

      delete updatedMaterials[firstKey];

      updatedMaterials[newUrl] = newCourseMaterial;

      set({ courseMaterials: updatedMaterials });
    },
    clearStore: () => {
      set({ courseMaterials: {}, isLoading: false });
    },
  })
);
