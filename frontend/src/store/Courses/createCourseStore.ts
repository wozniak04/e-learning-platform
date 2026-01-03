import axios from "axios";
import { BACKEND_URL } from "../../variables";
import { create } from "zustand";
import type { Create_new_Course_State } from "../Storetypes";
export const useCreateNewCourseStore = create<Create_new_Course_State>(
  (set, get) => ({
    isCreating: false,
    title: "",
    updatetitle: (title) => {
      set({ title });
    },
    description: "",
    updatedescription: (description) => {
      set({ description });
    },
    quick_description: "",
    updatequick_description: (quick_description) => {
      set({ quick_description });
    },
    type: "",
    updatetype: (type) => {
      set({ type });
    },
    img: null,
    updateimg: (img) => {
      set({ img });
    },
    password: null,
    updatepassword: (password) => {
      set({ password });
    },
    createNewCourse: async () => {
      const { title, description, quick_description, type, img, password } =
        get();
      set({ isCreating: true });

      try {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("quick_description", quick_description);

        if (type) formData.append("type", type);
        if (password) formData.append("password", password);

        if (img) {
          formData.append("img", img);
        }

        await axios.post(`${BACKEND_URL}/courses/create`, formData, {
          withCredentials: true,
        });

        set({ isCreating: false });
        get().clearStore();
      } catch (error: any) {
        set({ isCreating: false });

        throw new Error(
          error.response?.data?.message || "Błąd podczas tworzenia kursu"
        );
      }
    },
    clearStore: () => {
      set({
        isCreating: false,
        title: "",
        description: "",
        quick_description: "",
        type: "",
        img: null,
        password: null,
      });
    },
  })
);
