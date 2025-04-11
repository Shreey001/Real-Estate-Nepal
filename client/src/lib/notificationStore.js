import { create } from "zustand";
import apiRequest from "./apiRequest";

export const useNotificationStore = create((set) => ({
  number: 0,
  fetch: async () => {
    try {
      const response = await apiRequest.get("/users/notification");
      set({ number: response.data });
    } catch (error) {
      console.log(error);
    }
  },
  decrese: () => {
    set((prev) => ({ number: prev.number - 1 }));
  },
  reset: () => {
    set({ number: 0 });
  },
}));
