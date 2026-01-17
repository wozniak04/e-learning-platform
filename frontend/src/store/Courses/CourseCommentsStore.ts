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

    addComment: async (courseUrl, newComment, newRating) => {
      set({ isLoading: true });

      try {
        await axios.post(
          `${BACKEND_URL}/courses/${courseUrl}/comment`,
          { comment: newComment, rating: newRating },
          {
            withCredentials: true,
          }
        );
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

      } catch (error) {
        set({ isLoading: false });
        console.error("Error adding comment:", error);
        throw error;
      }
    },
    sortComments: (courseUrl, sortBy) => {
      const currentData = get().comments[courseUrl];
      if (!currentData) return;

      const sortedList = [...currentData.comments].sort((a, b) => {
        switch (sortBy) {
          case 'rating-desc':
            return b.review_rating - a.review_rating;
          case 'rating-asc':
            return a.review_rating - b.review_rating;
          case 'date-desc':
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          case 'date-asc':
            return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          default:
            return 0;
        }
      });
      set((state) => ({
        comments: {
          ...state.comments,
          [courseUrl]: {
            ...currentData,
            comments: sortedList,
          },
        },
      }));
    },
    clearStore: () => {
      set({ comments: {}, isLoading: false });
    },
  })
);
