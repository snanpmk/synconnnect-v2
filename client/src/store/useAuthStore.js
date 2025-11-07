// store/useAuthStore.js
import { create } from "zustand";

const useAuthStore = create((set) => ({
  user: null,
  accessToken: null,
  intendedPath: "/",

  setUser: (user) => set({ user }),
  setAccessToken: (token) => set({ accessToken: token }),

  setIntendedPath: (path) => set({ intendedPath: path }),
  clearIntendedPath: () => set({ intendedPath: null }),

  clearAuth: () =>
    set({
      user: null,
      accessToken: null,
      intendedPath: null,
    }),
}));

export default useAuthStore;
