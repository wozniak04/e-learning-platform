import axios from "axios";
import { BACKEND_URL } from "../../variables";
import { create } from "zustand";
import type { CourseCommentsStore } from "../Storetypes";

export const useCourseCommentsStore = create<CourseCommentsStore>(
  (set, get) => ({
    comments: {},
    isLoading: false,

    fetchComments: async (courseUrl) => {
      if (get().comments[courseUrl]) {
        return get().comments[courseUrl];
      }

      set({ isLoading: true });
      try {
        const response = await axios.get(
          `${BACKEND_URL}/courses/${courseUrl}/comments`
        );
        const data = response.data.comments;

        set({
          comments: {
            ...get().comments,
            [courseUrl]: data,
          },
          isLoading: false,
        });

        return data;
      } catch (error) {
        console.error("Error fetching comments:", error);
        set({ isLoading: false });
        return null;
      }
    },

    addComment: async (courseUrl, newComment) => {
      set({ isLoading: true });
      try {
        const result = await axios.post(
          `${BACKEND_URL}/courses/${courseUrl}/comments`,
          newComment,
          {
            withCredentials: true,
          }
        );
        set({
          comments: {
            ...get().comments,
            [courseUrl]: {
              average_rating: result.data.newAverage,
              comment: [...get().comments[courseUrl].comment, newComment],
            },
          },
        });
      } catch (error) {
        set({ isLoading: false });
        console.error("Error adding comment:", error);
        throw error;
      }
    },

    clearStore: () => {
      set({ comments: {}, isLoading: false });
    },
  })
);
